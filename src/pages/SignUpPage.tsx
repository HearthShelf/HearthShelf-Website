import { SignUp } from '@clerk/clerk-react'
import { Wordmark } from '@/components/Wordmark'
import { APP_URL, clerkEnabled } from '@/lib/utils'
import './auth.css'

/**
 * Sign-up embedded on hearthshelf.com, reached from the nav and from the
 * sign-in screen. Same on-domain, identically-skinned account experience as
 * app.hearthshelf.com.
 */
export function SignUpPage() {
  return (
    <div className="hs-auth-page">
      <div className="hs-auth-brand">
        <img src="/flame.png" alt="" className="hs-auth-flame" />
        <Wordmark style={{ fontSize: '3em' }} />
      </div>
      {clerkEnabled ? (
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/" />
      ) : (
        <div className="hs-auth-fallback">
          <p>Account creation is handled on the HearthShelf app.</p>
          <a className="hs-btn hs-btn-primary hs-btn-lg" href={`${APP_URL}/sign-up`}>
            <span className="ms fill">rocket_launch</span>Continue to HearthShelf
          </a>
        </div>
      )}
    </div>
  )
}

export default SignUpPage
