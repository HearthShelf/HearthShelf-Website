// SEED CONTENT - not final legal copy. Written from what's actually implemented
// / true about the project today, for a dedicated legal-review pass to expand
// and formalize (entity name, jurisdiction, liability language, etc.).
// As of: 2026-07 (alpha/beta).

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-brand text-xl font-bold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          HearthShelf is alpha/beta software, provided as-is while it's under active development.
          These terms will be formalized before general availability.
        </p>
      </div>

      <Section title="What HearthShelf is">
        <p>
          HearthShelf is a user interface for Audiobookshelf (ABS). It does not host, source, or
          distribute media content. You are responsible for the legality of the content in your
          library and for the backend (ABS instance) you connect it to. HearthShelf is not affiliated
          with Audiobookshelf.
        </p>
      </Section>

      <Section title="Alpha/beta status">
        <p>
          The product is under active development. Features may change or break, data schemas may be
          reset, and uptime is not guaranteed for either self-hosted releases or the hosted service at
          app.hearthshelf.com. Back up your own data (your ABS library/database) independently of
          HearthShelf.
        </p>
      </Section>

      <Section title="Self-hosted use">
        <p>
          Self-hosted HearthShelf runs on your own hardware under the AGPL v3 license. You're
          responsible for securing your own deployment, keeping it updated, and complying with any
          laws that apply to your use and your content.
        </p>
      </Section>

      <Section title="Hosted mode (app.hearthshelf.com)">
        <p>
          Hosted mode is an account-brokering service that links your Clerk-authenticated account to
          your self-hosted box(es). We are not a host of your media or library data in this mode - your
          content stays on your own box. See the Privacy Policy for what account/link metadata we do
          store to make this work.
        </p>
        <p>
          We may suspend or deregister a linked box for abuse, security concerns, or to protect the
          service, and we log such moderation actions internally.
        </p>
      </Section>

      <Section title="Acceptable use">
        <ul className="ml-5 list-disc space-y-1">
          <li>Don't use HearthShelf or the hosted service to distribute content you don't have the rights to.</li>
          <li>Don't attempt to abuse, overload, or gain unauthorized access to the hosted infrastructure or another user's box.</li>
          <li>Don't use the email relay for spam or unsolicited messages.</li>
        </ul>
      </Section>

      <Section title="No warranty">
        <p>
          HearthShelf is provided "as is," without warranty of any kind, express or implied, during
          this alpha/beta period. Use in production or with irreplaceable data at your own discretion.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          As the product moves toward general availability, these terms will be reviewed and expanded
          (entity/jurisdiction details, liability limits, dispute resolution, etc.). Material changes
          will be noted here.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Questions about these terms: reach us through the channels linked in the site footer
          (Discord, GitHub). A dedicated contact address will be added as part of the pre-GA legal
          review.
        </p>
      </Section>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        This is a living document during alpha/beta and will change as the product does. Last
        reviewed: 2026-07.
      </p>
    </div>
  )
}

export default TermsPage
