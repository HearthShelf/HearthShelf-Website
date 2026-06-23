# WebApp Architecture

The hosted WebApp (`app.hearthshelf.com`) is a single front door that lets a user reach every HearthShelf / AudiobookShelf server they have access to from one URL, after authenticating once. This page covers how that works: the trust model, identity, and how a browser ends up talking directly to your server.

## The boundary that defines everything

The WebApp repository is **proprietary and closed-source**. It can only stay that way because it never touches the AGPL-licensed HearthShelf source — it is a *client* of your server's public HTTP/Socket API, no different from any third-party client.

The moment that codebase imported, vendored, linked against, or copied AGPL source, AGPL's network clause would force the hosted app open. So knowledge crosses the boundary as **API contracts only** — request/response shapes — never as shared code. A behavior may be reimplemented to look identical; the file that does it is never copied.

## The cast of pieces

| Piece | License | Role |
|---|---|---|
| WebApp SPA + control plane | Proprietary | The hosted front door. Talks to HS servers over their public API only. |
| HearthShelf server | AGPL-3.0 | Your self-hosted SPA + QuestGiver backend, acting as a gateway in front of an internal ABS. |
| AudiobookShelf | AGPL-3.0 | The actual library server. Runs internal-only; HearthShelf proxies to it. |

**The key fact:** `app.hearthshelf.com` talks to your **HearthShelf server (the gateway)**, not to ABS directly. ABS stays unexposed behind HearthShelf. That's what lets HearthShelf broker the auth bridge while ABS keeps using plain username/password internally if you want.

## Identity in one paragraph

You sign into **Clerk** once for `app.hearthshelf.com`. The **control plane** knows which HearthShelf servers that identity is linked to. For each linked server, the client obtains a short-lived, signed **grant assertion** and talks to that server **directly**. The server verifies the assertion **offline** and resolves a per-user ABS credential. ABS scopes data to the matched per-user account. No second auth screen; no centrally stored ABS passwords.

```
                  sign in once
   You (browser) ────────────────► Clerk  (identity for app.hearthshelf.com)
        │
        │ "which servers am I linked to?"
        ▼
   Control plane  ──  links: identity → [ {server, grant} … ]
        │
        │ short-lived SIGNED assertion:
        │ "user X, verified email, linked to server Y, exp 5m"
        ▼
   Your HearthShelf server (hosted mode)
        │  - verifies the assertion offline with a pinned public key
        │  - resolves a per-user ABS credential
        │  - ABS stays internal, never exposed
        └── ABS (internal only)
```

## Trust: verifying a request offline

A HearthShelf server must be able to confirm that an incoming request truly represents an authenticated user who is actually linked to *that* server — **without calling the control plane**. Servers often sit behind a firewall, and a control-plane outage must never lock you out of your own server.

The mechanism is a **pinned public key + JWKS cache + short-TTL signed assertions**:

1. **Pairing bootstraps trust.** When a server is linked, it receives and **pins the control plane's public verification key** — the "cert."
2. **Every grant is a short-lived signed token.** The control plane signs an assertion (*"user X, verified email, linked to server Y, expires in ~5 minutes"*). The server verifies the signature locally with the pinned key. No callback needed — it works behind a firewall and survives a control-plane outage.
3. **Caching keeps it offline.** The server caches the control plane's JWKS and refreshes periodically.
4. **Revocation is just expiry.** Un-inviting a user or unlinking a server means the control plane stops re-issuing assertions; access dies within the TTL. No revocation list to sync.

There is **one signing keypair per control plane**, not per server. Every server trusts the same `app.hearthshelf.com` signing key; the assertion's "linked to server Y" claim is what scopes it. Key rotation is supported from the start.

## Tokens: server mints, client holds, direct connection

- After verifying the control-plane grant, your HearthShelf server mints short-lived **per-user** access tokens. The **client holds** them.
- The browser talks to your HearthShelf server **directly** with that token. The **control plane never holds ABS credentials** and is never a traffic bottleneck — compromising the front door does not hand over libraries.
- The control-plane API and token format stay plain (REST + bearer, no web-only cookie assumptions) so a future native mobile app reuses them verbatim. Web and mobile are the same math.

## Authenticating into ABS

ABS scopes everything — progress, bookmarks, permissions, library access — to the individual ABS user. There is no shared identity, so a single shared ABS credential is never used.

Hosted mode resolves a **per-user ABS credential** without storing passwords. ABS exposes per-user **API keys** (bound to a user id, acting as that user); your HearthShelf server matches the ABS user by verified email and mints a per-user API key with the admin token, then caches it. No ABS OIDC setup, no stored passwords, revocable per user, and ABS stays fully internal.

::: info OIDC as a future option
An earlier design federated users into ABS via OIDC (HearthShelf acting as the OIDC provider). The shipped implementation uses API-key minting instead — simpler, with zero stored passwords. The OIDC bridge remains a viable future enhancement if users ever want ABS's native login screen.
:::

## Hosting

| Layer | Where |
|---|---|
| SPA | Cloudflare Pages |
| Control plane | Cloudflare Workers + D1 (edge SQLite) |
| Live playback Socket.io | **Browser → your HearthShelf server directly**, never through the Worker |

The control plane only does control-plane work — auth brokering, the server registry, invite emails. Library traffic and the live playback socket never pass through it.
