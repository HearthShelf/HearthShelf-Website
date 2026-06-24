import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Canonical external URLs for the HearthShelf surfaces. */
export const DOCS_URL = 'https://docs.hearthshelf.com'
export const APP_URL = 'https://app.hearthshelf.com'
export const GITHUB_URL = 'https://github.com/HearthShelf/HearthShelf'
export const DISCORD_URL = 'https://discord.gg/c62ECD4EuC'

/**
 * Clerk publishable key, inlined by Vite at build time. When it's absent (e.g.
 * the build env var wasn't set), `clerkEnabled` is false and the site renders
 * without <ClerkProvider> - the landing still works and the auth controls fall
 * back to plain links into app.hearthshelf.com instead of white-screening.
 */
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
export const clerkEnabled = Boolean(CLERK_PUBLISHABLE_KEY)
