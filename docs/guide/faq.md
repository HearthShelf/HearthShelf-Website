# FAQ

## Does HearthShelf replace AudiobookShelf?

No. HearthShelf only replaces the web UI. AudiobookShelf continues to manage your files, process uploads, transcode audio, and serve your library. HearthShelf is the face — ABS is the engine.

## Will the ABSORB mobile app still work?

Yes. With the transparent reverse-proxy model (see [Reverse Proxy](/setup/reverse-proxy)), you can run both HearthShelf (browser) and the native ABSORB mobile app through the same public hostname. Your family only needs one address.

## Do I need to modify my ABS server?

No ABS configuration changes are required for basic setup. For the optional transparent reverse-proxy (ABSORB compatibility), you'll want to set ABS's external/base URL to your public hostname. For OpenID Connect login, your OIDC provider needs to have the HearthShelf callback URL added to its allowed-redirect list.

## Will my ABS progress sync work?

Yes. HearthShelf syncs playback progress with your ABS server every 30 seconds while playing, on pause, and when you close the tab (via `sendBeacon`). Your progress is stored in ABS, not HearthShelf.

## Can my family use HearthShelf with their ABS accounts?

Yes. HearthShelf authenticates against ABS, so every ABS user account works. Each user logs in with their own ABS credentials.

## Does HearthShelf support OpenID Connect?

Yes. The OpenID button appears on the login page when your ABS server has OpenID configured. HearthShelf implements the full OAuth2 PKCE flow.

## Does HearthShelf work offline?

No. HearthShelf fetches all data from your ABS server in real-time. Offline/PWA mode is not in scope. For offline listening, use the native ABSORB app.

## Why is ABS not public-facing in the recommended setup?

In the [transparent reverse-proxy](/setup/reverse-proxy) model, ABS binds only to the internal Docker network and is never exposed directly. All traffic — web and mobile — flows through the HearthShelf nginx container. This keeps ABS as an internal service and gives you a single point of TLS termination.

## What browsers are supported?

Any modern browser that supports ES2022+. Chrome, Firefox, Safari, and Edge are all supported. Mobile browsers work but the layout is desktop-first.

## Can I use HearthShelf with multiple ABS libraries?

Yes. HearthShelf supports multi-library setups. The sidebar lets you switch between your ABS libraries.

## Where is HearthShelf's data stored?

HearthShelf stores nothing. Your library, progress, and settings all live in AudiobookShelf. The only thing HearthShelf persists locally is your auth token (in `localStorage`) so you stay logged in across sessions.
