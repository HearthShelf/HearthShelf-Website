import type { ReactNode } from 'react'

/**
 * Two-column legal document shell. The left column carries the binding legal
 * text; the right carries a non-binding plain-language restatement of the same
 * clause. Both describe the same obligations and must be edited together.
 */
export function LegalDoc({
  title,
  updated,
  summary,
  children,
}: {
  title: string
  updated: string
  summary?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <header>
        <h1 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        {summary ? (
          <div className="mt-6 rounded-lg border border-l-[3px] border-border border-l-primary bg-card/60 px-5 py-4 text-sm leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
            {summary}
          </div>
        ) : null}
      </header>

      <div
        className="mt-10 hidden gap-10 border-b border-border pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-muted-foreground lg:flex"
        aria-hidden="true"
      >
        <span className="flex-1">The terms</span>
        <span className="flex-1 text-primary">In plain language</span>
      </div>

      <div>{children}</div>
    </div>
  )
}

export function Clause({
  id,
  title,
  plain,
  children,
}: {
  id?: string
  title: string
  plain: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="border-b border-border py-8 last:border-b-0">
      <h2 className="font-brand mb-4 text-xl font-bold">{title}</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-10">
        <div className="min-w-0 flex-1 space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
          {children}
        </div>
        <aside className="min-w-0 flex-1 rounded-lg bg-card/60 px-4 py-4 text-sm leading-relaxed text-muted-foreground lg:rounded-none lg:border-l lg:border-border lg:bg-transparent lg:py-0 lg:pl-6 lg:pr-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_p+p]:mt-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:ml-5 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1">
          <span className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.09em] text-primary lg:hidden">
            In plain language
          </span>
          {plain}
        </aside>
      </div>
    </section>
  )
}
