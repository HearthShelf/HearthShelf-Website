import { SignUp } from '@clerk/clerk-react'
import { Wordmark } from '@/components/Wordmark'
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
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/" />
    </div>
  )
}

export default SignUpPage
