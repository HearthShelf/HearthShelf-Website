# Getting Started

Get HearthShelf running in under five minutes with Docker Compose.

## Prerequisites

- A running [AudiobookShelf](https://www.audiobookshelf.org/) server on your network
- Docker and Docker Compose installed on your host machine

::: info
HearthShelf does **not** replace your ABS server — it only replaces the web UI. You need ABS running before HearthShelf is useful.
:::

## Quick Start

Create a `docker-compose.yml` file:

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

- [Docker configuration details](/setup/docker)
- [Setting up a reverse proxy](/setup/reverse-proxy) — for public HTTPS access
- [Authentication options](/setup/authentication) — username/password and OpenID Connect
- [Configuration reference](/setup/configuration) — all environment variables
