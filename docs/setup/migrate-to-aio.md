# Migrate to All-in-One

This guide moves an existing setup — HearthShelf (slim) pointed at a separate AudiobookShelf container — onto the single [all-in-one image](/setup/all-in-one), without losing any data.

The trick is simple: the AIO image runs the **same AudiobookShelf** inside it, so your existing ABS `config`, `metadata`, and `audiobooks` volumes plug straight in. HearthShelf detects that ABS is already set up, skips provisioning, and you keep your existing accounts and logins.

::: info Who this is for
You're running two containers today — the slim HearthShelf image plus `ghcr.io/advplyr/audiobookshelf` — and you want to consolidate to one. If you run HearthShelf against an ABS server you *don't* want to bundle (a NAS appliance, a shared server), stay on the [slim image](/setup/docker).
:::

## Before You Start

- **Back up first.** Copy your ABS `config` volume (it holds `absdatabase.sqlite`) and your HearthShelf `/app/data` volume somewhere safe.
- Note where your current volumes live. The steps below assume bind mounts (`./config`, `./metadata`, `./audiobooks`); adapt the paths if you use named volumes.
- Your **AudiobookShelf version matters.** The AIO image bundles a specific ABS version. Make sure it is the same as, or newer than, the version that wrote your database — ABS migrates its database forward on boot but cannot go backward. Check your current ABS version in its UI before switching.

## Step 1: Stop the Current Stack

```bash
docker compose down
```

This stops both the slim HearthShelf container and your separate ABS container. Your data stays on the volumes.

## Step 2: Swap in the AIO Compose File

Replace your two-service `docker-compose.yml` with a single AIO service that **reuses the same volume paths** your ABS container used.

Before (two containers):

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest
    ports: ["3000:80"]
    environment:
      - ABS_SERVER_URL=http://abs:13378
      - PUBLIC_URL=https://books.mydomain.com
    networks: [internal]

  abs:
    image: ghcr.io/advplyr/audiobookshelf:latest
    volumes:
      - ./audiobooks:/audiobooks
      - ./config:/config
      - ./metadata:/metadata
    networks: [internal]

networks:
  internal:
```

After (one container — point it at the **same** `./config`, `./metadata`, `./audiobooks`):

```yaml
services:
  hearthshelf:
    image: ghcr.io/hearthshelf/hearthshelf:latest-aio
    ports: ["3000:80"]
    environment:
      - PUBLIC_URL=https://books.mydomain.com
    volumes:
      - ./audiobooks:/audiobooks
      - ./config:/config        # <- your existing ABS config volume
      - ./metadata:/metadata    # <- your existing ABS metadata volume
      - ./hearthshelf-data:/app/data  # <- your existing HearthShelf data volume
    restart: unless-stopped
```

::: warning Drop `ABS_SERVER_URL`
The AIO image talks to the bundled ABS on loopback automatically. Remove `ABS_SERVER_URL` — leaving it set can point HearthShelf at the wrong server.
:::

Keep `PUBLIC_URL` exactly as it was so your reverse proxy, OIDC redirects, and any native (ABSORB) clients keep working unchanged.

## Step 3: Start and Verify

```bash
docker compose up -d
docker compose logs -f hearthshelf
```

In the logs you should see HearthShelf detect the existing ABS and **skip provisioning**:

```
[aio-provision] ABS already initialised; marking provisioned without new credentials
```

That line confirms your existing database was found. Open `http://localhost:3000` (or your public URL) and **sign in with your existing AudiobookShelf account** — all your libraries, users, and progress are intact.

Because ABS is already set up, the first-run wizard does **not** generate new credentials. You will not be prompted to connect to app.hearthshelf.com automatically; you can still do that any time from **Settings → Connect**.

## What Carries Over

| Data | Carries over? | Lives in |
|---|---|---|
| Libraries, books, podcasts | Yes | `/config` (ABS database) |
| User accounts & passwords | Yes | `/config` |
| Listening progress & sessions | Yes | `/config` |
| Covers & derived metadata | Yes | `/metadata` |
| HearthShelf settings, QuestGiver history, Discover feedback | Yes | `/app/data` |
| app.hearthshelf.com pairing | Yes | `/app/data` |

Nothing is duplicated — HearthShelf has always treated ABS as the source of truth, so bundling ABS changes *where it runs*, not *what it stores*.

## Rolling Back

If anything looks wrong, you can return to the two-container setup: `docker compose down`, restore your previous `docker-compose.yml`, and `docker compose up -d`. Your volumes were never modified destructively, so the old stack comes back exactly as it was. (This is why the backup in *Before You Start* matters — keep it until you're confident.)

## Troubleshooting

**"I see a setup wizard asking me to create an account."**
HearthShelf didn't find an existing ABS database — usually a volume path typo. Check that `/config` points at the directory containing your `absdatabase.sqlite`. Stop the container, fix the path, and start again.

**"ABS won't start after the switch."**
The bundled ABS version may be older than the one that wrote your database. Pin the AIO image to a tag at or above your previous ABS version, or update ABS first, then migrate.

**"Native apps (ABSORB) can't connect anymore."**
Make sure `PUBLIC_URL` is unchanged and your reverse proxy still forwards to the container. The transparent proxy behavior is identical between slim and AIO — see [Reverse Proxy](/setup/reverse-proxy).
