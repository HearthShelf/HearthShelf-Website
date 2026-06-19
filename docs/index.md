---
layout: home

hero:
  name: "HearthShelf"
  text: "A beautiful home for your audiobooks."
  tagline: A self-hosted, browser-first replacement UI for AudiobookShelf. Your ABS library, redesigned from the ground up.
  image:
    src: /logo.svg
    alt: HearthShelf
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: What is HearthShelf?
      link: /guide/what-is-hearthshelf

features:
  - icon: 🎧
    title: Pure UI Layer
    details: HearthShelf is only the face. AudiobookShelf remains your backend — HearthShelf just makes it beautiful. No new database, no file management, no server logic.

  - icon: 🐳
    title: Single Docker Container
    details: Deploy with one command. A static SPA served via nginx — configure your ABS server URL once, and everything routes through a clean proxy.

  - icon: 📱
    title: ABSORB-Compatible
    details: The transparent reverse-proxy model means native ABS clients (like ABSORB) and HearthShelf share a single public hostname. Your family just needs one address.

  - icon: 🔒
    title: Self-Hosted First
    details: Your library, your server, your network. HearthShelf runs entirely behind your firewall with no external dependencies and no telemetry.

  - icon: ⚡
    title: Vite + React 19
    details: Built with the modern stack — Vite, React 19, TypeScript strict mode, TanStack Query, Zustand, and shadcn/ui. Fast, type-safe, and easy to extend.

  - icon: 🔑
    title: Full Auth Support
    details: Username/password login and OAuth2/OIDC (OpenID Connect) supported out of the box. Token persists across sessions with on-load validation.
---
