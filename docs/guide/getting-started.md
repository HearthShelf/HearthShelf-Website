# Getting Started

Get HearthShelf running in under five minutes with Docker Compose. Pick the path that matches your setup.

## Which Setup?

- **Starting fresh / want the simplest install** → use the **All-in-One** image. One container holds HearthShelf *and* AudiobookShelf; it sets ABS up for you. Jump to [All-in-One Quick Start](#all-in-one-quick-start).
- **Already running AudiobookShelf** → use the **Slim** image and point it at your server. Jump to [Slim Quick Start](#slim-quick-start).

## Prerequisites

- Docker and Docker Compose installed on your host machine
- For the slim path: a running [AudiobookShelf](https://www.audiobookshelf.org/) server on your network

## All-in-One Quick Start

The most frictionless way to start. Create a `docker-compose.yml`:

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest-aio
    ports:
      - "3000:80"
    environment:
      - PUBLIC_URL=http://localhost:3000
    volumes:
      - ./audiobooks:/audiobooks
      - ./abs-config:/config
      - ./abs-metadata:/metadata
      - ./hearthshelf-data:/app/data
    restart: unless-stopped
```

```bash
docker compose up -d
```

Open `http://localhost:3000`. HearthShelf sets up the bundled AudiobookShelf for you and walks you through a short setup wizard — see the [All-in-One guide](/setup/all-in-one) for what to expect (including your generated admin credentials).

## Slim Quick Start

Use this if you already run AudiobookShelf. Create a `docker-compose.yml`:

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest
    ports:
      - "3000:80"
    environment:
      - ABS_SERVER_URL=http://192.168.1.100:13378
    restart: unless-stopped
```

Replace `192.168.1.100:13378` with your ABS server's address, then run:

```bash
docker compose up -d
```

Open `http://localhost:3000` in your browser and log in with your ABS credentials.

::: info
On the slim image HearthShelf does **not** replace your ABS server — it only replaces the web UI. You need ABS running before HearthShelf is useful.
:::

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ABS_SERVER_URL` | Yes | Internal URL of your AudiobookShelf server (e.g. `http://192.168.1.100:13378`) |
| `PORT` | No | Port HearthShelf listens on (default: `80`) |
| `PUBLIC_URL` | Recommended | Your public hostname — used for OIDC redirect rewriting (e.g. `https://books.mydomain.com`) |

## Accessing HearthShelf

Once the container starts, open HearthShelf at the port you mapped (e.g. `http://localhost:3000`).

Log in with the same username and password you use for AudiobookShelf. HearthShelf validates your token against ABS — no separate account is needed.

## Next Steps

- [All-in-One image guide](/setup/all-in-one) — the single-container setup in detail
- [Migrate to All-in-One](/setup/migrate-to-aio) — consolidate an existing slim + ABS setup
- [Docker configuration details](/setup/docker)
- [Setting up a reverse proxy](/setup/reverse-proxy) — for public HTTPS access
- [Authentication options](/setup/authentication) — username/password and OpenID Connect
- [Configuration reference](/setup/configuration) — all environment variables
