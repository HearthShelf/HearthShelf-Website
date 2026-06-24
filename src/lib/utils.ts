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
