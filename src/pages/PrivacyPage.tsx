// SEED CONTENT - not final legal copy. Written from what's actually implemented
// in the codebase today, for a dedicated legal-review pass to expand/verify.
// Update this comment's "as of" note whenever the underlying data flows change.
// As of: 2026-07 (alpha/beta).

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-brand text-xl font-bold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  )
}

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-brand text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          HearthShelf is alpha/beta software. This page describes what we actually collect today,
          in plain language. It will be expanded and formalized before general availability.
        </p>
      </div>

      <Section title="What HearthShelf is">
        <p>
          HearthShelf is a user interface. Self-hosted, it runs entirely on hardware you control and
          talks to your own Audiobookshelf (ABS) server - we (the developers) never see your library,
          your books, or your account unless you explicitly opt in to something below. Hosted mode
          (app.hearthshelf.com) additionally involves our infrastructure to broker access to your
          self-hosted box, and is covered separately below.
        </p>
      </Section>

      <Section title="Self-hosted mode (no HearthShelf servers involved)">
        <p>
          If you run HearthShelf entirely on your own hardware and never enable anonymous telemetry
          or the email relay, no data about your library or your users ever reaches us. Authentication,
          library data, and listening history stay on your box and in your ABS instance.
        </p>
      </Section>

      <Section title="Hosted mode (app.hearthshelf.com)">
        <p>
          Hosted mode lets you sign in with Clerk and link your self-hosted box(es) to your account so
          you can reach them from a single front door without exposing your box directly to the
          internet. To do this, our control plane (a Cloudflare Worker + D1 database) stores:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Your Clerk account identifier and the email address associated with it</li>
          <li>Which of your boxes you've linked, and your role on each (owner/member)</li>
          <li>Certificate and pairing metadata needed to broker a secure connection to your box</li>
          <li>
            Email-relay usage counters, if you use our relay to send invite/notification emails from
            your box (see below)
          </li>
        </ul>
        <p>
          Platform staff do not browse this data as a matter of routine. Our internal admin console is
          being scoped down deliberately: it shows fleet-wide health (is a box online, is its cert
          valid, is it erroring) without listing the people linked to any given box. Anyone with
          platform-admin access could still query the database directly if required for support or a
          security investigation, and such access is logged in an internal audit trail.
        </p>
      </Section>

      <Section title="Anonymous usage telemetry (opt-in, off by default)">
        <p>
          Self-hosted admins can opt in to sharing anonymous usage statistics that power the public
          community stats page. When enabled, a box periodically reports: a random per-install ID
          (not tied to your Clerk account or any person), the HearthShelf/ABS version it's running,
          whether it's in self-hosted or hosted mode, coarse bucketed ranges (e.g. "2-5 users", not
          exact counts or names), and lifetime totals like books finished or quests completed. No
          usernames, emails, book titles, or library contents are included. This can be turned off at
          any time from Config &gt; Community on your box.
        </p>
      </Section>

      <Section title="Debug logs and crash reports (alpha/beta only)">
        <p>
          While HearthShelf is in alpha/beta, we collect additional debugging data to find and fix
          bugs faster than we otherwise could:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            The mobile app can report crash logs, which are stamped with your Clerk account ID
            (server-side, so it can't be spoofed) so we can correlate repeated crashes to a specific
            install while investigating.
          </li>
          <li>
            Self-hosted boxes can forward error events to our infrastructure for debugging; these
            include a source IP address and whatever detail the box includes about the error (which
            could incidentally contain identifying information if it appears in a stack trace or
            error message).
          </li>
        </ul>
        <p>
          This debugging data is intended to be temporary for the alpha/beta period. We expect to
          reduce collection, add automatic redaction, and/or add an explicit opt-out as the product
          stabilizes toward general availability. If you have concerns about this in the meantime,
          reach out (see Contact below).
        </p>
      </Section>

      <Section title="Email">
        <p>
          If you use our email relay to send invites or notifications from your self-hosted box, the
          recipient's email address passes through our infrastructure to our email provider in order
          to deliver the message. We do not use this for marketing.
        </p>
      </Section>

      <Section title="What we don't do">
        <ul className="ml-5 list-disc space-y-1">
          <li>We don't sell your data.</li>
          <li>We don't read or scan your library contents.</li>
          <li>We don't share individual user data with third parties except as needed to operate the service (e.g. our email and hosting providers).</li>
        </ul>
      </Section>

      <Section title="Your choices">
        <ul className="ml-5 list-disc space-y-1">
          <li>Self-host without hosted mode, telemetry, or the email relay to keep everything on your own hardware.</li>
          <li>Turn anonymous telemetry on or off at any time.</li>
          <li>Ask us to delete your hosted-mode account data (see Contact below).</li>
        </ul>
      </Section>

      <Section title="Contact">
        <p>
          Questions about this policy or a request regarding your data: reach us through the channels
          linked in the site footer (Discord, GitHub). A dedicated contact address and formal request
          process will be added here as part of the pre-GA legal review.
        </p>
      </Section>

      <p className="mt-12 text-center text-xs text-muted-foreground">
        This is a living document during alpha/beta and will change as the product does. Last
        reviewed: 2026-07.
      </p>
    </div>
  )
}

export default PrivacyPage
