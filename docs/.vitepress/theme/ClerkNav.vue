<script setup lang="ts">
// The live Clerk-backed nav control. Only imported (lazily, by NavAuth) when a
// publishable key is configured and the Clerk plugin is installed - so importing
// @clerk/vue here is always safe.
import { Show, UserButton, ClerkLoaded } from '@clerk/vue'

const APP_URL = 'https://app.hearthshelf.com'
</script>

<template>
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
