# Authentication

HearthShelf authenticates against your AudiobookShelf server. No separate HearthShelf account is needed — any ABS user can log in.

## Username & Password

The standard ABS login. Enter the same credentials you use to log into ABS directly.

HearthShelf calls `POST /abs-api/login` with your credentials. On success, ABS returns a token which HearthShelf stores in `localStorage` (token only — no password is ever persisted). The token is validated on every page load via `POST /abs-api/api/authorize`.

## OpenID Connect (OIDC)

When your ABS server has OpenID enabled, a second login button appears automatically. HearthShelf detects this by checking the `/abs-api/status` endpoint — no configuration needed on the HearthShelf side.

HearthShelf implements the full **OAuth2 PKCE flow**:

1. HearthShelf generates a PKCE verifier, code challenge, and random state value, stored in `sessionStorage`.
2. The browser navigates to the ABS OIDC initiation endpoint with the challenge and your `redirect_uri`.
3. ABS redirects to your configured identity provider.
4. The provider authenticates and returns to `https://books.mydomain.com/oauth/callback`.
5. HearthShelf validates the state, sends the code + verifier to ABS, and receives the auth token.
6. Normal session begins.

### Prerequisites for OIDC

| Requirement | Where to configure |
|---|---|
| ABS has OpenID set up | ABS server admin settings |
| `https://books.mydomain.com/oauth/callback` in ABS "Mobile Redirect URIs" | ABS OpenID settings |
| Same callback URL in your OIDC provider's allowed-redirect list | Your identity provider |
| HearthShelf is running at `PUBLIC_URL` | `PUBLIC_URL` env var |

::: warning Same-origin requirement
ABS requires the `redirect_uri` to be same-origin as the ABS request. Because HearthShelf proxies ABS through the same hostname (`/abs-api`), using your public HearthShelf URL as the `redirect_uri` satisfies this automatically.
:::

## Token Lifecycle

| Event | Action |
|---|---|
| First login | Token stored in `localStorage`, user state in memory |
| Page load | Token read from `localStorage`, validated via `/api/authorize` |
| Token invalid | Cleared, redirected to login |
| Logout | Token cleared from `localStorage` and Zustand store |

Only the token is persisted — user state is re-fetched from ABS on every load.

## Multi-User

Each ABS user account works independently — everyone logs in the same way, with their own AudiobookShelf credentials. Admin-only features (server configuration, user management, and first-run setup) are gated by the role ABS returns for the signed-in user, so regular users simply don't see them.
