import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'

/**
 * The site's error + 404 screen. Mirrors the main HearthShelf app and webapp:
 * the SittingInTheHearth backdrop under a dark scrim, a hearth-gold code, a
 * shelf-cream serif heading, and calm copy. The image is served from public/.
 */
export default function ErrorPage() {
  const navigate = useNavigate()
  const error = useRouteError()

  // Three cases: a 404 route response, no error at all (the `*` catch-all route
  // renders this directly for unmatched URLs), or a thrown render/loader error.
  const isNotFound = !error || (isRouteErrorResponse(error) && error.status === 404)
  const code = isRouteErrorResponse(error) ? error.status : isNotFound ? 404 : 500
  const title = isNotFound ? 'Page not found' : 'Something went wrong'
  const message = isNotFound
    ? "This shelf is empty. The page you're looking for doesn't exist or has been moved."
    : 'An unexpected error occurred while loading this page.'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/SittingInTheHearth.webp)' }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-7xl font-bold leading-none text-[var(--brand-hearth)]">{code}</p>
        <div className="flex flex-col gap-2">
          <h1 className="font-brand text-2xl font-bold text-[var(--wordmark-shelf)]">{title}</h1>
          <p className="max-w-xs text-sm leading-relaxed text-white/60">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer rounded-lg border border-primary bg-primary px-[18px] py-[9px] text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Go home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer rounded-lg border border-white/20 bg-white/[0.08] px-[18px] py-[9px] text-sm font-medium text-[var(--wordmark-shelf)] transition-colors hover:border-primary hover:text-primary"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
