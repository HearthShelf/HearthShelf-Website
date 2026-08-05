import { Clause, LegalDoc } from '@/components/legal/LegalDoc'

function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      updated="July 31, 2026"
      summary={
        <>
          <strong>The short version:</strong> if you self-host HearthShelf and leave telemetry off,
          nothing about your library or your users ever reaches us. If you use the hosted front door
          at app.hearthshelf.com, we hold your email and which servers you have linked, but never
          your books or listening history. The mobile app sends a weekly anonymous install ping that
          is <strong>on by default</strong> and can be turned off in Settings. We never sell data.
        </>
      }
    >
      <Clause
        id="controller"
        title="1. Who we are and what this covers"
        plain={
          <p>
            HearthShelf is a front end for Audiobookshelf, run by NYX Services LLC, a Minnesota
            company. This policy covers the hosted service at app.hearthshelf.com, the mobile apps,
            and the bits of the self-hosted app that can talk to us. It does not cover Audiobookshelf
            itself, which is a separate project.
          </p>
        }
      >
        <p>
          <strong>NYX Services LLC</strong>, a limited liability company organised under the laws of
          the State of Minnesota, United States ("we", "us"), operates the hosted service at
          app.hearthshelf.com, the HearthShelf mobile applications for iOS and Android, and the
          marketing website at hearthshelf.com. In respect of those services we act as a data
          controller.
        </p>
        <p>
          HearthShelf is an interface for Audiobookshelf ("ABS"), a separate and unaffiliated
          open-source project which remains the source of truth for your library, playback, and
          progress data. Where you self-host HearthShelf, you are the controller of the data held on
          your own hardware, and this policy describes only those features capable of transmitting
          data to us.
        </p>
        <p>
          Contact for data protection matters:{' '}
          <a href="mailto:privacy@nyxservices.com">privacy@nyxservices.com</a>.
        </p>
      </Clause>

      <Clause
        id="selfhosted"
        title="2. Self-hosted deployments"
        plain={
          <p>
            Run it on your own box, leave telemetry off, and skip the email relay, and we genuinely
            never see anything. Your logins, library, listening history, notes, and book clubs all
            stay on your hardware. Securing that box is your job, not ours.
          </p>
        }
      >
        <p>
          Where HearthShelf is deployed on infrastructure you control and the optional features
          described in Sections 4 and 6 are not enabled, no personal data is transmitted to us.
          Authentication, library metadata, listening history, user-generated content, and all
          application state are processed and stored exclusively on your hardware.
        </p>
        <p>
          In that configuration you act as the controller in respect of data belonging to users of
          your instance, and you are responsible for the security of the deployment, for compliance
          with data protection law applicable to you, and for responding to requests from your users.
        </p>
      </Clause>

      <Clause
        id="hosted"
        title="3. The hosted service (app.hearthshelf.com)"
        plain={
          <>
            <p>
              The hosted front door lets you sign in once and reach your own servers without exposing
              them to the internet. To do that we store:
            </p>
            <ul>
              <li>Your account ID and email address</li>
              <li>Which servers you have linked and your role on each</li>
              <li>Pairing and certificate details needed to reach your box securely</li>
              <li>For "remembered devices": a label, a profile image URL, and a hashed PIN</li>
            </ul>
            <p>
              <strong>We are never in the path of your actual library data.</strong> We broker the
              connection; we do not proxy your books.
            </p>
          </>
        }
      >
        <p>
          The hosted service brokers access between your account and the self-hosted instances you
          have linked to it. Authentication is provided by Clerk, Inc. (see Section 7). Our control
          plane stores the following categories of personal data:
        </p>
        <ul>
          <li>Your Clerk user identifier and verified primary email address</li>
          <li>
            The identifiers of instances you have linked, your role on each (owner or member), and an
            optional display name
          </li>
          <li>
            Pairing records, certificate metadata, and local network addresses required to establish a
            secure connection to your instance
          </li>
          <li>
            Where you elect to remember a device, a device label, a profile image URL, and a salted
            hash of the PIN you set. The PIN itself is not stored
          </li>
          <li>
            Email addresses of persons you invite to your instance, retained until the invitation is
            accepted or expires
          </li>
          <li>Counters recording use of the email relay, for the purpose of quota enforcement</li>
        </ul>
        <p>
          <strong>
            The control plane is not in the data path for library content, playback, or listening
            history.
          </strong>{' '}
          It never receives, proxies, or stores credentials for your Audiobookshelf instance.
        </p>
        <p>
          Personnel do not access this data in the ordinary course. The internal administration
          console is scoped to fleet health indicators and does not enumerate the individuals linked
          to a given instance. Persons holding platform administrator privileges retain the technical
          ability to query the underlying database where necessary for support or the investigation of
          a security incident, and such access is recorded in an internal audit log.
        </p>
      </Clause>

      <Clause
        id="telemetry"
        title="4. Usage telemetry"
        plain={
          <>
            <p>
              There are two separate telemetry channels, with different defaults. This matters, so
              here it is plainly:
            </p>
            <ul>
              <li>
                <strong>Self-hosted server stats: off by default.</strong> An admin has to turn these
                on. The Config screen shows you the exact payload before you enable it. It sends a
                random install ID, version numbers, and rounded buckets like "6-20 users" - never
                names, emails, or book titles.
              </li>
              <li>
                <strong>Mobile install ping: ON by default.</strong> Once a week the app sends a
                random install ID, your device model, and OS version. It is not tied to your account.
                Turn it off under Settings &rarr; Community.
              </li>
            </ul>
            <p>
              Both feed the public stats page. Turning them off stops future reports but does not
              delete ones already sent, because they are not linked to you in any way we could search
              by.
            </p>
          </>
        }
      >
        <p>
          <strong>Self-hosted instance telemetry is disabled by default.</strong> An administrator of
          an instance may enable it, which constitutes an instance-wide election affecting all users
          of that instance. Prior to enabling, the configuration interface displays a preview of the
          exact payload that would be transmitted. Enabling generates a fresh random identifier which
          is deliberately distinct from the instance's pairing identifier, so that reports cannot be
          correlated with a linked account. Reports are transmitted on startup and thereafter at
          seven-day intervals, without authentication, and comprise: the random install identifier,
          platform, HearthShelf and Audiobookshelf version numbers, deployment mode, bucketed user and
          library size ranges, and lifetime aggregate counters. No usernames, email addresses, book or
          library titles, IP addresses, or instance names are included.
        </p>
        <p>
          <strong>
            The mobile applications transmit an install heartbeat which is enabled by default.
          </strong>{' '}
          It is transmitted at most once per seven days, is unauthenticated, and is not associated
          with your account. It comprises a random per-installation identifier, platform, device
          model, device type, operating system name and version, and application version. No
          advertising identifier is collected. This may be disabled at any time under Settings &rarr;
          Community; the preference is stored per device so that it survives reinstallation.
        </p>
        <p>
          Telemetry is used solely to publish aggregate community statistics and to understand which
          application versions and devices are in active use. Reports are stored as a single record
          per installation, updated on receipt rather than accumulated as an event history. Aggregate
          output never discloses an individual installation's record.
        </p>
        <p>
          Because telemetry records contain no identifier linking them to an account, we are unable to
          locate or erase the records of a particular person on request. Disabling telemetry prevents
          further transmission but does not remove previously submitted records.
        </p>
      </Clause>

      <Clause
        id="diagnostics"
        title="5. Crash reports and diagnostic logs"
        plain={
          <>
            <p>
              The mobile app sends crashes to Sentry, plus performance data from roughly one launch in
              ten. Session replay and profiling are switched off. There is currently no in-app opt-out
              for crash reporting.
            </p>
            <p>
              If you use the in-app feedback form,{' '}
              <strong>your name and email are attached to it</strong> and sent to Sentry along with
              your message.
            </p>
            <p>
              Self-hosted boxes can forward error events to us, which include the source IP and
              whatever appears in the error. Those logs are deleted after 30 days.
            </p>
          </>
        }
      >
        <p>
          The mobile applications transmit crash and error reports to Sentry (Functional Software,
          Inc.), together with performance traces sampled at approximately ten per cent of application
          launches. Session replay and profiling are disabled. Sentry's "default PII" collection is
          not enabled. There is at present no user-facing opt-out for crash reporting in the mobile
          applications; it is disabled only in builds compiled with diagnostics switched off.
        </p>
        <p>
          <strong>
            Where you submit a report through the in-application feedback form, your name and email
            address are transmitted to Sentry alongside the message you compose,
          </strong>{' '}
          prefilled from your account. Do not include information in that form which you do not wish
          to disclose to that processor.
        </p>
        <p>
          The mobile applications additionally transmit diagnostic logs to our own infrastructure,
          authenticated with your session. The receiving service overwrites the submitted identity
          with the verified account identifier, so that reports are attributable and cannot be forged.
          Self-hosted instances may forward warning and error events, which include the source IP
          address recorded for abuse triage and such detail as the instance includes; that detail may
          incidentally contain identifying information where it appears within a stack trace or error
          message.
        </p>
        <p>
          <strong>Diagnostic logs held by us are retained for thirty days</strong> and are then
          deleted automatically. Data held by Sentry is subject to that processor's own retention
          configuration and is not removed by deletion of your HearthShelf account.
        </p>
      </Clause>

      <Clause
        id="library"
        title="6. Library content and AI features"
        plain={
          <>
            <p>
              We do not read, scan, or index your library. It is on your hardware and we have no route
              to it.
            </p>
            <p>
              <strong>One important exception:</strong> if the admin of your instance enables the AI
              recommendation features and supplies their own API key, then book titles, authors,
              genres, and a summary of listening habits are sent from that box directly to whichever
              AI provider they chose. That is your instance talking to OpenAI, Anthropic, or Google,
              not us. Pointing it at a local model keeps it all in-house.
            </p>
          </>
        }
      >
        <p>
          We do not read, scan, index, or otherwise process the contents of your library. In
          self-hosted deployments we have no technical means of doing so, and in hosted mode we are
          not in the data path.
        </p>
        <p>
          Where an administrator enables the recommendation features and configures credentials for a
          third-party AI provider, the instance transmits prompt data directly from your hardware to
          that provider. Such prompts include book titles, authors, genres, and durations for
          candidate items, together with a derived profile of listening preferences. Supported
          providers include OpenAI, Anthropic, and Google, as well as any OpenAI-compatible endpoint
          including locally hosted inference servers, selection of which results in no transmission
          beyond your own network.
        </p>
        <p>
          <strong>
            We are not a party to that transmission and do not receive the prompts or responses.
          </strong>{' '}
          The credential is held by the instance and the processing is governed by the terms of the
          provider selected by the administrator, who is responsible for establishing an appropriate
          lawful basis for it.
        </p>
      </Clause>

      <Clause
        id="processors"
        title="7. Service providers"
        plain={
          <>
            <p>These are the companies that process data on our behalf:</p>
            <ul>
              <li>
                <strong>Clerk</strong> - sign-in. Holds your email, password, and any Google, Apple,
                or Discord accounts you connect.
              </li>
              <li>
                <strong>Cloudflare</strong> - hosting and databases for everything above.
              </li>
              <li>
                <strong>Sentry</strong> - crash reports.
              </li>
              <li>
                <strong>Resend</strong> - sends emails, so it sees the recipient address.
              </li>
              <li>
                <strong>Expo and Google Firebase</strong> - app updates and push notifications.
              </li>
            </ul>
            <p>We do not sell your data to anyone, for any purpose.</p>
          </>
        }
      >
        <p>
          We engage the following processors, each under a data processing agreement incorporating the
          safeguards required by Article 28 of the GDPR:
        </p>
        <ul>
          <li>
            <strong>Clerk, Inc.</strong> (United States) &mdash; identity and authentication. Holds
            your email address, authentication credentials, username and name where supplied,
            connected third-party identities (Google, Apple, Discord), profile image, active device
            records, and a telephone number where you enable SMS-based two-factor authentication.
          </li>
          <li>
            <strong>Cloudflare, Inc.</strong> (United States) &mdash; hosting, edge delivery, and
            database storage for the control plane, diagnostic logs, and marketing site. Also
            processes standard server logs.
          </li>
          <li>
            <strong>Functional Software, Inc. (Sentry)</strong> (United States) &mdash; crash and
            error reporting for the mobile applications, including feedback submissions containing
            name and email address.
          </li>
          <li>
            <strong>Resend</strong> (United States) &mdash; transactional email delivery. Receives
            recipient addresses and message contents.
          </li>
          <li>
            <strong>Expo</strong> (United States) &mdash; application builds, over-the-air updates,
            and push notification delivery.
          </li>
          <li>
            <strong>Google LLC (Firebase Cloud Messaging)</strong> (United States) &mdash; push
            notification delivery on Android.
          </li>
        </ul>
        <p>
          <strong>
            We do not sell personal information, and we do not share it for cross-context behavioural
            advertising,
          </strong>{' '}
          as those terms are defined under the California Consumer Privacy Act. We have not done so in
          the preceding twelve months. We operate no advertising network and no behavioural profiling.
        </p>
        <p>
          All processors named above are established in the United States. Transfers are effected
          under the Standard Contractual Clauses adopted by the European Commission, together with the
          UK International Data Transfer Addendum where applicable, as incorporated into each
          processor's data processing terms.
        </p>
      </Clause>

      <Clause
        id="bases"
        title="8. Legal bases for processing"
        plain={
          <p>
            For readers in the UK or EU: we process your account data because we need it to provide
            the service you asked for, we rely on legitimate interest for crash reports and security,
            and we rely on your consent for the optional telemetry and email relay.
          </p>
        }
      >
        <p>
          Where the UK GDPR or EU GDPR applies, we rely on the following legal bases under Article
          6(1):
        </p>
        <ul>
          <li>
            <strong>Performance of a contract</strong> (Article 6(1)(b)) for the account, linking, and
            connection-brokering data described in Section 3, being necessary to provide the hosted
            service you have requested.
          </li>
          <li>
            <strong>Consent</strong> (Article 6(1)(a)) for self-hosted instance telemetry, the
            optional email relay, and the AI features, each of which requires an affirmative election
            to enable. Consent may be withdrawn at any time by disabling the feature.
          </li>
          <li>
            <strong>Legitimate interests</strong> (Article 6(1)(f)) for crash reporting, diagnostic
            logging, the mobile install heartbeat, and the retention of source IP addresses for abuse
            triage. Our interests are maintaining the reliability and security of the service; these
            are balanced against your rights by the limited categories collected, the absence of
            account linkage in the heartbeat, and the thirty-day retention limit on logs. You may
            object to processing on this basis as described in Section 10.
          </li>
        </ul>
      </Clause>

      <Clause
        id="retention"
        title="9. How long we keep things"
        plain={
          <p>
            Account and linking data lasts as long as your account. Diagnostic logs are deleted after
            30 days. Invitations expire. Telemetry is stored as one row per install, overwritten each
            time, and is not tied to you.
          </p>
        }
      >
        <p>
          Account records, instance links, preferences, and entitlements are retained for the duration
          of your account and are deleted on the exercise of the deletion right described in Section
          10. Diagnostic and infrastructure logs are retained for thirty days. Pending invitations are
          retained until accepted or until expiry. Remembered-device records are retained until their
          stated expiry or until revoked by you.
        </p>
        <p>
          Telemetry records are stored as a single row per installation and updated on receipt rather
          than accumulated. They contain no account linkage and are consequently not deleted as part
          of an account deletion request.
        </p>
      </Clause>

      <Clause
        id="rights"
        title="10. Your rights and deleting your account"
        plain={
          <>
            <p>
              You can delete your hosted account yourself: Account &rarr; Danger zone &rarr; Delete my
              HearthShelf data. That removes your server links, preferences, plan, remembered devices,
              and crash reports, then deletes your identity from Clerk.
            </p>
            <p>Two things deliberately survive:</p>
            <ul>
              <li>Invitations you sent to other people, since those are arguably their records</li>
              <li>The admin audit trail, kept as an operational record</li>
            </ul>
            <p>
              <strong>This does not touch your self-hosted server</strong> - that data is yours and
              stays where it is. Crash data already sent to Sentry is also not removed by this.
            </p>
          </>
        }
      >
        <p>
          Under the UK GDPR, EU GDPR, and comparable regimes you hold rights of access, rectification,
          erasure, restriction, objection, and portability. Residents of California hold rights under
          the CCPA as amended by the CPRA, including the rights to know, to delete, to correct, and to
          opt out of sale or sharing. We do not sell or share personal information and therefore
          operate no opt-out mechanism for that purpose. We will not discriminate against you for
          exercising any right.
        </p>
        <p>
          <strong>A self-service deletion facility is available</strong> in the hosted application
          under Account, in the "Danger zone" section. On exercise it deletes, in order: your instance
          links, stored preferences, plan entitlement, remembered-device records, and diagnostic log
          entries attributed to you, and thereafter deletes your identity record from Clerk.
        </p>
        <p>Two categories are deliberately retained and are not deleted by that operation:</p>
        <ul>
          <li>
            Pending invitations you issued to other persons, which are keyed to the invitee's email
            address and are treated as records concerning that person rather than you
          </li>
          <li>
            Entries in the administrative audit log, retained as a record of operational and security
            actions. The deletion itself is recorded as a final entry
          </li>
        </ul>
        <p>
          Deletion of your hosted account has no effect on data held on a self-hosted instance, which
          remains under the control of that instance's operator. Crash and feedback data previously
          transmitted to Sentry is subject to that processor's retention schedule and is not removed
          by this operation; requests concerning it may be directed to us at the address below.
        </p>
        <p>
          Requests may be made to{' '}
          <a href="mailto:privacy@nyxservices.com">privacy@nyxservices.com</a>. You have the right to
          lodge a complaint with a supervisory authority: in the United Kingdom, the Information
          Commissioner's Office; within the EEA, the authority of your habitual residence.
        </p>
      </Clause>

      <Clause
        id="children"
        title="11. Children"
        plain={
          <p>
            The hosted service is not for children under 16, and we do not knowingly collect their
            data. If you self-host for a family, that instance is your responsibility.
          </p>
        }
      >
        <p>
          The hosted service is not directed at children and we do not knowingly collect personal data
          from persons under the age of sixteen. Where you believe such data has been provided,
          contact us and it will be removed. Operators of self-hosted instances are responsible for
          any processing of children's data on their own deployment.
        </p>
      </Clause>

      <Clause
        id="changes"
        title="12. Changes to this policy"
        plain={
          <p>
            HearthShelf is still in active development and this policy will change with it. Material
            changes will be announced rather than slipped in quietly.
          </p>
        }
      >
        <p>
          This policy will be revised as the service develops. Where a revision materially alters the
          categories of data collected or the purposes of processing, we will provide notice through
          the application or the release changelog before it takes effect. The date of last revision
          appears at the head of this document.
        </p>
      </Clause>

      <Clause
        id="contact"
        title="13. Contact"
        plain={
          <p>
            Privacy questions: <a href="mailto:privacy@nyxservices.com">privacy@nyxservices.com</a>.
            General support is better on Discord or GitHub.
          </p>
        }
      >
        <p>
          The data controller is <strong>NYX Services LLC</strong>, a limited liability company
          organised under the laws of the State of Minnesota, United States. Enquiries concerning this
          policy and requests to exercise the rights described in Section 10 may be directed to{' '}
          <a href="mailto:privacy@nyxservices.com">privacy@nyxservices.com</a>, and a postal address
          for the company is available on request to that address. General support enquiries may be
          raised through the community channels linked in the site footer.
        </p>
      </Clause>
    </LegalDoc>
  )
}

export default PrivacyPage
