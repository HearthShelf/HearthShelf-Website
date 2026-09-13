import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { clerkAppearance } from '@/auth/clerkAppearance'
import { CLERK_PUBLISHABLE_KEY, clerkEnabled } from '@/lib/utils'
import './index.css'

// No warning when the key is absent: that is now the INTENDED state, not a
// misconfiguration. HearthShelf accounts are created by the app's own auth
// service, so every auth control here links into app.hearthshelf.com. The
// provider branches below remain only so this can be switched back on without
// a rewrite; see wrangler.toml.

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
