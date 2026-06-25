import { createBrowserRouter } from 'react-router-dom'
import Home from '@/components/landing/Home'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'
import ChangelogPage from '@/pages/ChangelogPage'
import ErrorPage from '@/pages/ErrorPage'

export const router = createBrowserRouter([
  // errorElement catches thrown render/loader errors on each route; the trailing
  // splat catches unmatched URLs as a 404. Both render the branded ErrorPage.
  { path: '/', element: <Home />, errorElement: <ErrorPage /> },
  { path: '/changelog', element: <ChangelogPage />, errorElement: <ErrorPage /> },
  // Splats so Clerk's path-based routing owns the sub-steps (verify, SSO, etc.)
  { path: '/sign-in/*', element: <SignInPage />, errorElement: <ErrorPage /> },
  { path: '/sign-up/*', element: <SignUpPage />, errorElement: <ErrorPage /> },
  { path: '*', element: <ErrorPage /> },
])
