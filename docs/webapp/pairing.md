# Linking & Invites

There are two flows that get people into the hosted WebApp: an admin **links a server** once, then **invites users** by email. Both are designed to be one-step and to leave no stored secrets behind.

## Linking a server (admin, once per server)

During HearthShelf install or setup, the admin opts into `app.hearthshelf.com`. HearthShelf surfaces a short **pairing code** — the same idea as pairing a streaming device, where the device shows a code and you enter it on the website.

The admin enters that code once on `app.hearthshelf.com`. Pairing does two things:

- **Establishes the link on both sides** — a record in the control plane *and* in your HearthShelf server's own database. It's an explicit, revocable grant in both places.
- **Delivers the control plane's public key** to your server, bootstrapping the offline [trust model](/webapp/architecture#trust-verifying-a-request-offline).

Your ABS server never needs anything configured by hand — HearthShelf brokers the whole thing.

```
HearthShelf setup  ──►  shows a pairing code
                              │
        admin enters it once on app.hearthshelf.com
                              │
                              ▼
   link recorded on both sides + public key pinned to your server
```

## Inviting users (the Plex "invite by email" flow)

An admin invites someone by email; that person clicks, makes (or already has) an account, and everything else just happens.

```
Admin invites alice@email.com
        │
        │  control plane sends the invite email
        ▼
Alice clicks → creates / signs in to her account (app.hearthshelf.com)
        │
        │  control plane pre-provisions her ABS user
        ▼
First connect to her library:
   - username pulled from her account, set on the ABS account
   - matched into ABS by VERIFIED email
   - she's in — no second auth screen
```

ABS has **no invite or pending-user concept** and sends no invitation emails, so the control plane owns invites and invite delivery. The ABS user is **pre-provisioned** (rather than relying on auto-register) so the username and password lifecycle are deliberate.

### The temp password lifecycle

ABS requires a username *and* password when a user is created. The control plane generates a temporary, secure password it holds only transiently — the user never sees it. On first connect, HearthShelf asks whether you want a backup password to log into that server directly (for native ABS apps):

- **Yes** → you set one; it's written via the API and **immediately forgotten**. ABS then holds the only copy.
- **No** → the temp-password record is **destroyed**. You're SSO-only; a server admin can reset it later if you ever need direct access.

The result: in steady state the control plane holds **zero usable ABS passwords**.

### Matching is by verified email

Users are matched into ABS **by verified email** — never by anything spoofable — so nobody is ever linked to the wrong identity. Emails are verified by the identity provider, and only the verified address is used for the match.

## Revoking access

Because trust is built on short-lived signed assertions, revocation is simple: un-invite a user or unlink a server, and the control plane stops issuing new grant assertions for them. Their access expires within the assertion's short TTL — there's no revocation list to push out to servers.
