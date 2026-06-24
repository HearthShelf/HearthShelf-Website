import { createBrowserRouter } from 'react-router-dom'
import Home from '@/components/landing/Home'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  // Splats so Clerk's path-based routing owns the sub-steps (verify, SSO, etc.)
  { path: '/sign-in/*', element: <SignInPage /> },
  { path: '/sign-up/*', element: <SignUpPage /> },
])
