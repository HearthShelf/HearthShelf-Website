# All-in-One Image

HearthShelf ships in two flavors:

| Image | Tag | Use it when |
|---|---|---|
| **Slim** | `ghcr.io/hearthshelf/hearthshelf:latest` | You already run AudiobookShelf and want HearthShelf as its face. |
| **All-in-One** | `ghcr.io/hearthshelf/hearthshelf:latest-aio` | You want one container that *is* the whole stack — HearthShelf with AudiobookShelf bundled inside. |

The **all-in-one** (AIO) image is the most frictionless way to start. It contains the official AudiobookShelf server alongside HearthShelf. HearthShelf sets ABS up for you on first boot and owns the entire onboarding flow, so you never touch ABS's own setup screens.

::: tip Already running ABS?
If you have an existing AudiobookShelf server, use the [slim image](/setup/docker) instead — point it at your server. If you'd rather consolidate down to a single container later, see [Migrate to All-in-One](/setup/migrate-to-aio).
:::

## Quick Start

Create a `docker-compose.yml`:

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest-aio
    ports:
      - "3000:80"
    environment:
      - PUBLIC_URL=http://localhost:3000
    volumes:
      # Your audiobooks
      - ./audiobooks:/audiobooks
      # Bundled ABS state (database, config, derived metadata)
      - ./abs-config:/config
      - ./abs-metadata:/metadata
      # HearthShelf's own state (settings sync, QuestGiver history)
      - ./hearthshelf-data:/app/data
    restart: unless-stopped
```

```bash
docker compose up -d
```

Open `http://localhost:3000`. On the very first launch HearthShelf provisions the bundled ABS in the background; within a few seconds the **setup wizard** appears.

## What Happens on First Boot

You don't run ABS's first-run setup — HearthShelf does it for you:

1. It waits for the bundled AudiobookShelf to come up.
2. It creates the ABS **root user** with a strong generated password.
3. It signs in to mint an admin token it reuses internally.
4. It creates a default **Audiobooks** library pointed at `/audiobooks`.
5. It records that setup is done, so this only ever runs once.

When the wizard loads it:

- **Reveals your generated admin credentials once.** Save them, then change the password in Settings.
- Signs you in automatically.
- **Defaults to connecting to app.hearthshelf.com** — the easiest way to reach your library from anywhere and invite people by email. You can opt out and stay fully local; you can also change this later.

::: warning Save your admin credentials
The generated root password is shown **once** and then cleared from storage. Write it down (or change it immediately in Settings) before leaving the wizard.
:::

## Volumes

| Path | Holds | Back this up |
|---|---|---|
| `/audiobooks` | Your audiobook files | Your originals |
| `/config` | The bundled ABS database + config (`absdatabase.sqlite`) | **Yes** |
| `/metadata` | ABS-derived metadata (covers, cache) | Optional (regenerable) |
| `/app/data` | HearthShelf's state (`hearthshelf.db`) | **Yes** |

Back up `/config` and `/app/data` the same way you'd back up any ABS install. Stop the container first to capture the SQLite `-wal`/`-shm` sidecars cleanly.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PUBLIC_URL` | Recommended | — | Your public hostname — used for OIDC redirect rewriting and as the address app.hearthshelf.com reaches |
| `QG_PROVIDER` | No | — | AI provider for QuestGiver recommendations (leave empty to use the heuristic engine) |
| `QG_API_KEY` | No | — | API key for the AI provider (stays in-container, never sent to the browser) |
| `QG_MODEL` | No | — | Model id for the AI provider |
| `QG_ENABLED` | No | `true` | Toggle the QuestGiver feature |
| `DISCOVER_ENABLED` | No | `true` | Toggle the Discover surface |

You do **not** set `ABS_SERVER_URL` on the AIO image — it points at the bundled ABS on `127.0.0.1` automatically.

::: tip Pointing native apps here too
nginx is the only ingress (port 80). The bundled ABS is reachable only through it, so a native client like ABSORB can use the same `PUBLIC_URL` as the browser. See [Reverse Proxy](/setup/reverse-proxy).
:::

## How It Runs Inside the Container

One container runs three processes:

- **nginx** on port 80 — the only ingress.
- the **bundled AudiobookShelf** on `127.0.0.1:13378` — reachable only through nginx.
- the **HearthShelf backend** on `127.0.0.1:8080` — QuestGiver, settings sync, onboarding.

A small supervisor starts all three; if any one exits, the container stops so your restart policy (`restart: unless-stopped`) recycles it cleanly.

## Updating

```bash
docker compose pull
docker compose up -d
```

This updates both HearthShelf and the bundled AudiobookShelf together. Your data on the volumes is untouched.

## Restoring an Existing ABS Volume

If you mount a `/config` volume that already has an ABS root user (for example, you're [migrating from slim](/setup/migrate-to-aio)), HearthShelf detects that ABS is already set up and skips provisioning. It can't recover your existing root password, so sign in with your existing AudiobookShelf account.
