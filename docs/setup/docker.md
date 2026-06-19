# Docker Setup

HearthShelf uses a **runtime configuration** approach. A single Docker image works for any ABS server URL — no rebuild required. The `ABS_SERVER_URL` environment variable is injected into the nginx config at container start via `envsubst`.

## Basic Setup

```yaml
# docker-compose.yml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest
    ports:
      - "3000:80"
    environment:
      - ABS_SERVER_URL=http://192.168.1.100:13378
    restart: unless-stopped
```

```bash
docker compose up -d
```

## With ABS on the Same Stack

Run HearthShelf and AudiobookShelf together, with ABS kept internal-only:

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest
    ports:
      - "3000:80"
    environment:
      - ABS_SERVER_URL=http://abs:13378
      - PUBLIC_URL=https://books.mydomain.com
    depends_on: [abs]
    networks: [internal]
    restart: unless-stopped

  abs:
    image: ghcr.io/advplyr/audiobookshelf:latest
    volumes:
      - ./audiobooks:/audiobooks
      - ./podcasts:/podcasts
      - ./config:/config
      - ./metadata:/metadata
    # NO ports: mapping — ABS only reachable via HearthShelf
    networks: [internal]
    restart: unless-stopped

networks:
  internal:
```

::: tip ABSORB compatibility
With the `internal` network setup and no `ports:` on ABS, the [transparent reverse-proxy](/setup/reverse-proxy) configuration lets the ABSORB mobile app use the same `PUBLIC_URL` as the browser. Users need only one address for everything.
:::

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ABS_SERVER_URL` | Yes | — | Internal URL of your ABS server |
| `PUBLIC_URL` | Recommended | — | Public hostname for OIDC redirect rewriting |

## What Happens at Container Start

The `docker-entrypoint.sh` runs `envsubst` to inject environment variables into the nginx config template, then starts nginx:

```sh
#!/bin/sh
envsubst '${ABS_SERVER_URL} ${PUBLIC_URL}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf
exec "$@"
```

This means you can update `ABS_SERVER_URL` by changing the environment variable and restarting the container — no image rebuild needed.

## Updating HearthShelf

```bash
docker compose pull
docker compose up -d
```

## Logs

```bash
docker compose logs -f hearthshelf
```
