import { useSearchParams } from 'react-router-dom'
import { SignIn } from '@clerk/clerk-react'
import { Wordmark } from '@/components/Wordmark'
import { APP_URL, clerkEnabled } from '@/lib/utils'
import './auth.css'

/**
 * Sign-in embedded on hearthshelf.com so the account experience stays on our
 * domain and in our shell, skinned identically to app.hearthshelf.com via the
 * shared clerkAppearance. Both sites share one Clerk instance, so signing in
 * here is the same session as the app.
 *
 * `routing="path"` lets Clerk own /sign-in/*. Query params surface a one-time
 * note so arriving here never feels like a dead-end: `signed_out=1` (deliberate
 * sign-out) and `reason=expired` (session expired / forced out).
 */
export function SignInPage() {
  const [params] = useSearchParams()
  const note =
    params.get('reason') === 'expired'
      ? 'Your session expired - please sign in again.'
      : params.get('signed_out')
        ? "You've been signed out."
        : null

  return (
    <div className="hs-auth-page">
      <div className="hs-auth-brand">
        <img src="/flame.png" alt="" className="hs-auth-flame" />
        <Wordmark style={{ fontSize: '3em' }} />
      </div>
      {note && <div className="hs-auth-note">{note}</div>}
      {clerkEnabled ? (
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/" />
      ) : (
        <div className="hs-auth-fallback">
          <p>Sign-in is handled on the HearthShelf app.</p>
          <a className="hs-btn hs-btn-primary hs-btn-lg" href={`${APP_URL}/sign-in`}>
            <span className="ms fill">rocket_launch</span>Continue to HearthShelf
          </a>
        </div>
      )}
    </div>
  )
}

export default SignInPage
