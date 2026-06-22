<script setup lang="ts">
// Auth control for the hs.com nav. Signed out -> Log in / Sign up (links into
// app.hearthshelf.com's embedded Clerk pages). Signed in -> "Open HearthShelf"
// + the account avatar. The link to the app is only surfaced when signed in
// (the app is gated too; this avoids a dead-end click).
//
// @clerk/vue gates content with <Show when="signed-in|signed-out">. Clerk is
// client-only, so the whole thing renders inside <ClientOnly> (a VitePress
// global) and waits for <ClerkLoaded> to avoid a flash before hydration.
import { Show, UserButton, ClerkLoaded } from '@clerk/vue'

const APP_URL = 'https://app.hearthshelf.com'
</script>

<template>
  <ClientOnly>
    <ClerkLoaded>
      <div class="auth-nav">
        <Show when="signed-out">
          <a class="auth-link" :href="`${APP_URL}/sign-in`">Log in</a>
          <a class="auth-cta" :href="`${APP_URL}/sign-up`">Sign up</a>
        </Show>
        <Show when="signed-in">
          <a class="auth-cta" :href="APP_URL">Open HearthShelf</a>
          <UserButton after-sign-out-url="https://hearthshelf.com" />
        </Show>
      </div>
    </ClerkLoaded>
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
