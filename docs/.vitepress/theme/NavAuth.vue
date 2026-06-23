<script setup lang="ts">
// Auth control for the hs.com nav. Signed out -> Log in / Sign up (links into
// app.hearthshelf.com's embedded Clerk pages). Signed in -> "Open HearthShelf"
// + the account avatar. The link to the app is only surfaced when signed in
// (the app is gated too; this avoids a dead-end click).
//
// @clerk/vue gates content with <Show when="signed-in|signed-out">. Clerk is
// client-only, so the whole thing renders inside <ClientOnly> (a VitePress
// global) and waits for <ClerkLoaded> to avoid a flash before hydration.
//
// The Clerk plugin is only installed when a publishable key is configured
// (see theme/index.ts). Without it, the Clerk components call useClerk() with
// no plugin and crash the nav - so we gate the live UI on `clerkReady` and
// fall back to plain Log in / Sign up links when Clerk isn't available.
import { defineAsyncComponent } from 'vue'

const APP_URL = 'https://app.hearthshelf.com'
const clerkReady = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Async so the @clerk/vue bundle is only pulled in when a key exists.
const ClerkNav = clerkReady
  ? defineAsyncComponent(() => import('./ClerkNav.vue'))
  : null
</script>

<template>
  <ClientOnly>
    <component :is="ClerkNav" v-if="ClerkNav" />
    <div v-else class="auth-nav">
      <a class="auth-link" :href="`${APP_URL}/sign-in`">Log in</a>
      <a class="auth-cta" :href="`${APP_URL}/sign-up`">Sign up</a>
    </div>
  </ClientOnly>
</template>

<style scoped>
.auth-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 4px;
}
.auth-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}
.auth-link:hover {
  color: var(--vp-c-brand-1);
}
.auth-cta {
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  padding: 6px 14px;
  border-radius: 8px;
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
.auth-cta:hover {
  background: var(--vp-c-brand-2);
}
</style>
