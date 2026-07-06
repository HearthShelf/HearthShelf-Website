import { createBrowserRouter } from 'react-router-dom'
import Home from '@/components/landing/Home'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'
import ChangelogPage from '@/pages/ChangelogPage'
import StatsPage from '@/pages/StatsPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import ErrorPage from '@/pages/ErrorPage'
import { SiteLayout } from '@/components/landing/SiteLayout'

export const router = createBrowserRouter([
  // errorElement catches thrown render/loader errors on each route; the trailing
  // splat catches unmatched URLs as a 404. Both render the branded ErrorPage.
  { path: '/', element: <Home />, errorElement: <ErrorPage /> },
  {
    path: '/changelog',
    element: (
      <SiteLayout>
        <ChangelogPage />
      </SiteLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/stats',
    element: (
      <SiteLayout>
        <StatsPage />
      </SiteLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/privacy',
    element: (
      <SiteLayout>
        <PrivacyPage />
      </SiteLayout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/terms',
    element: (
      <SiteLayout>
        <TermsPage />
      </SiteLayout>
    ),
    errorElement: <ErrorPage />,
  },
  // Splats so Clerk's path-based routing owns the sub-steps (verify, SSO, etc.)
  { path: '/sign-in/*', element: <SignInPage />, errorElement: <ErrorPage /> },
  { path: '/sign-up/*', element: <SignUpPage />, errorElement: <ErrorPage /> },
  { path: '*', element: <ErrorPage /> },
])
