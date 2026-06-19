# Configuration

HearthShelf is configured via environment variables passed to the Docker container.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ABS_SERVER_URL` | **Yes** | Internal URL of your AudiobookShelf server. This is the address nginx uses to proxy API requests — it should be reachable from within the container network, not the public internet. Example: `http://192.168.1.100:13378` or `http://abs:13378` if ABS is on the same Docker network. |
| `PUBLIC_URL` | Recommended | Your public-facing hostname. Used for OIDC redirect rewriting so that Location headers from ABS point to your public URL instead of the internal ABS address. Example: `https://books.mydomain.com`. |

## `.env` File

You can place these in a `.env` file alongside your `docker-compose.yml`:

```env
# .env
ABS_SERVER_URL=http://192.168.1.100:13378
PUBLIC_URL=https://books.mydomain.com
```

Then reference it in Compose:

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest
    env_file: .env
    ports:
      - "3000:80"
```

## Proxy Routes

HearthShelf nginx handles two categories of routes at runtime:

| Path | Destination | Notes |
|---|---|---|
| `/abs-api/*` | ABS (strips prefix) | HearthShelf SPA's REST calls |
| `/abs-socket/*` | ABS (strips prefix) | HearthShelf SPA's Socket.io |
| `/api/*` | ABS (transparent) | Native ABS clients (ABSORB) |
| `/socket.io/*` | ABS (transparent) | Native ABS websocket |
| `/login`, `/logout`, etc. | ABS (transparent) | Native ABS auth endpoints |
| Everything else | SPA (`index.html`) | React Router client-side routes |

See [Reverse Proxy](/setup/reverse-proxy) for the full transparent proxy setup.
