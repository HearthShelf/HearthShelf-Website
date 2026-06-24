import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { clerkAppearance } from '@/auth/clerkAppearance'
import { CLERK_PUBLISHABLE_KEY, clerkEnabled } from '@/lib/utils'
import './index.css'

if (!clerkEnabled) {
  // Not fatal: the site renders without auth (see lib/utils clerkEnabled).
  // Logged so a misconfigured build env var is obvious in the console.
  console.warn('VITE_CLERK_PUBLISHABLE_KEY is not set - auth controls fall back to links into app.hearthshelf.com')
}

const app = <RouterProvider router={router} />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {clerkEnabled ? (
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        appearance={clerkAppearance}
      >
        {app}
      </ClerkProvider>
    ) : (
      app
    )}
  </StrictMode>,
)
