import { Clause, LegalDoc } from '@/components/legal/LegalDoc'

function TermsPage() {
  return (
    <LegalDoc
      title="Terms of Service"
      updated="July 31, 2026"
      summary={
        <>
          <strong>The short version:</strong> HearthShelf is free, open-source (AGPL v3) software
          that puts a nicer face on Audiobookshelf. We do not host, supply, or distribute any books
          &mdash; you bring your own library and you are responsible for having the right to it. The
          hosted front door is free and provided as-is. It is still beta software, so keep your own
          backups.
        </>
      }
    >
      <Clause
        id="acceptance"
        title="1. Acceptance and scope"
        plain={
          <p>
            These terms cover the hosted service, the mobile apps, and this website, all run by NYX
            Services LLC. Using any of them means you accept these terms. Self-hosting the software
            on your own hardware is governed by the AGPL licence instead.
          </p>
        }
      >
        <p>
          These Terms of Service govern your use of the hosted service at app.hearthshelf.com, the
          HearthShelf mobile applications, and the website at hearthshelf.com (together, the
          "Service"), each operated by <strong>NYX Services LLC</strong>, a limited liability company
          organised under the laws of the State of Minnesota, United States ("we", "us"). By
          accessing or using the Service you agree to be bound by these terms. If you do not accept
          them, do not use the Service.
        </p>
        <p>
          Your use of the HearthShelf software itself, deployed on infrastructure you control, is
          governed by the GNU Affero General Public License version 3 rather than by these terms,
          save that Sections 6 and 7 apply to any use of the Service in connection with such a
          deployment.
        </p>
      </Clause>

      <Clause
        id="whatitis"
        title="2. What HearthShelf is, and what it is not"
        plain={
          <p>
            HearthShelf is an interface. Audiobookshelf holds your library and does the actual work;
            we just present it. <strong>We do not host, sell, supply, or distribute any audiobooks
            or ebooks</strong>, and we are not affiliated with the Audiobookshelf project. What is in
            your library, and whether you have the right to it, is entirely on you.
          </p>
        }
      >
        <p>
          HearthShelf is a user interface for Audiobookshelf, an independent open-source project with
          which we are not affiliated and which we do not endorse or represent. Audiobookshelf remains
          the source of truth for library data, playback, and progress.
        </p>
        <p>
          <strong>
            We do not host, source, supply, distribute, index, or make available any audiobook,
            ebook, or other media content.
          </strong>{' '}
          The Service provides no means of obtaining content. You are solely responsible for the
          content within your library, for the lawfulness of your possession and use of it, and for
          the Audiobookshelf deployment to which you connect.
        </p>
      </Clause>

      <Clause
        id="beta"
        title="3. Beta status"
        plain={
          <p>
            This is beta software under active development. Features will change, things will break,
            and data schemas may be reset. There is no uptime guarantee.{' '}
            <strong>Keep your own backups of your library and Audiobookshelf database</strong> -
            independently of HearthShelf.
          </p>
        }
      >
        <p>
          The Service is provided during a beta period of active development. Features may be
          altered, deprecated, or withdrawn without notice; defects are to be expected; data schemas
          may be reset between releases; and no availability, uptime, or continuity of service is
          warranted.
        </p>
        <p>
          You are responsible for maintaining independent backups of your library and Audiobookshelf
          database. Do not rely on the Service as the sole repository of material you cannot afford to
          lose.
        </p>
      </Clause>

      <Clause
        id="accounts"
        title="4. Accounts"
        plain={
          <p>
            You need to be 16 or older, give accurate details, and keep your login secure. You are
            responsible for what happens under your account. You can delete it at any time from the
            Account page.
          </p>
        }
      >
        <p>
          Registration for the hosted service requires an account created through our identity
          provider. You must be at least sixteen years of age. You agree to provide accurate
          registration information, to maintain the confidentiality of your credentials, and to accept
          responsibility for activity occurring under your account. Notify us promptly of any
          suspected unauthorised access.
        </p>
        <p>
          You may terminate your account at any time using the deletion facility described in the{' '}
          <a href="/privacy#rights">Privacy Policy</a>. We may suspend or terminate an account for
          breach of these terms, for abuse, or where necessary to protect the security or integrity of
          the Service.
        </p>
      </Clause>

      <Clause
        id="hosted"
        title="5. The hosted service"
        plain={
          <p>
            The hosted front door is free right now and connects you to your own servers. We may
            deregister a server that is being abused or that threatens the service. If we ever charge
            for anything, we will say so clearly first.
          </p>
        }
      >
        <p>
          The hosted service brokers access between your account and the self-hosted instances you
          link to it. <strong>We are not a host of your media or library data in this mode.</strong>{' '}
          The service is presently provided free of charge, and we reserve the right to introduce paid
          tiers in future, in which case the applicable terms and pricing will be presented before any
          charge arises.
        </p>
        <p>
          We may suspend, deregister, or rate-limit a linked instance where it is the source of abuse,
          where it presents a security concern, or where such action is necessary to protect the
          Service or its users. Such actions are recorded in an internal audit log.
        </p>
      </Clause>

      <Clause
        id="acceptable"
        title="6. Acceptable use"
        plain={
          <>
            <p>Do not:</p>
            <ul>
              <li>Distribute content you have no right to distribute</li>
              <li>Attack, overload, or break into our infrastructure or someone else's server</li>
              <li>Use the email relay to send spam</li>
              <li>Harass other users through notes or book clubs</li>
              <li>Circumvent rate limits or quotas</li>
            </ul>
          </>
        }
      >
        <p>You agree not to:</p>
        <ul>
          <li>
            Store, share, or distribute content in respect of which you do not hold the necessary
            rights
          </li>
          <li>
            Attempt to gain unauthorised access to, disrupt, overload, or impair the Service, its
            supporting infrastructure, or any instance operated by another person
          </li>
          <li>Use the email relay to transmit unsolicited bulk messages or other abusive traffic</li>
          <li>
            Use community features, including notes and book clubs, to harass, abuse, threaten, or
            defame any person, or to publish unlawful material
          </li>
          <li>
            Circumvent or attempt to circumvent rate limits, quotas, or access controls applied to the
            Service
          </li>
          <li>Reverse engineer or interfere with the security features of the Service</li>
        </ul>
      </Clause>

      <Clause
        id="ugc"
        title="7. Your content"
        plain={
          <p>
            Notes, book club posts, avatars, and reading history you create stay yours. On a
            self-hosted instance they never reach us at all &mdash; they live on that box, and its
            operator controls them. Note that deleting a note hides it rather than erasing it, so
            reply threads stay readable.
          </p>
        }
      >
        <p>
          You retain all rights in content you create through the Service, including book notes, book
          club contributions, avatars, and reading history. We claim no ownership of it.
        </p>
        <p>
          On self-hosted deployments such content is stored exclusively on the operator's hardware and
          is not transmitted to us. Visibility settings described as "public" operate within a single
          instance and do not publish content to the open internet. The operator of the instance
          controls that data and is responsible for its handling.
        </p>
        <p>
          Deletion of a note is implemented as a soft deletion, whereby the note is withdrawn from
          display but the underlying record is retained on the instance in order to preserve the
          integrity of reply threads. Operators may remove such records directly.
        </p>
      </Clause>

      <Clause
        id="ip"
        title="8. Copyright and infringement"
        plain={
          <p>
            We host no media, so there is usually nothing for us to take down. If you believe content
            on our hosted service infringes your copyright, email{' '}
            <a href="mailto:legal@nyxservices.com">legal@nyxservices.com</a>. Complaints about a
            self-hosted server need to go to whoever runs it.
          </p>
        }
      >
        <p>
          We do not host media content and therefore have limited capacity to act on infringement
          complaints concerning it. Where you believe material accessible through the hosted service
          infringes your copyright, submit a notice to{' '}
          <a href="mailto:legal@nyxservices.com">legal@nyxservices.com</a> containing the elements
          required by 17 U.S.C. &sect; 512(c)(3), including identification of the work, identification
          of the material, your contact details, a statement of good-faith belief, and a statement
          made under penalty of perjury that you are authorised to act.
        </p>
        <p>
          Complaints concerning material held on a self-hosted instance must be directed to the
          operator of that instance, over whose deployment we exercise no control. We will terminate
          the accounts of repeat infringers where appropriate.
        </p>
      </Clause>

      <Clause
        id="warranty"
        title="9. Disclaimer of warranties"
        plain={
          <p>
            The service is provided as-is with no promises about availability, accuracy, or fitness
            for your purpose. This is normal for free beta software.
          </p>
        }
      >
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR
          A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. We do not warrant that the Service will
          be uninterrupted, timely, secure, error-free, or that data will not be lost or corrupted.
        </p>
        <p>
          Nothing in these terms excludes or limits liability which cannot lawfully be excluded,
          including liability for death or personal injury caused by negligence, or for fraud.
        </p>
      </Clause>

      <Clause
        id="liability"
        title="10. Limitation of liability"
        plain={
          <p>
            The service is free, so our financial liability is capped at what you paid us, which is
            nothing, up to a floor of $100. We are not liable for lost data, lost listening history,
            or your Audiobookshelf server breaking.
          </p>
        }
      >
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, NOR FOR ANY LOSS OF DATA, LOSS OF PROFITS,
          LOSS OF GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH THE
          SERVICE, WHETHER IN CONTRACT, TORT, OR OTHERWISE, AND WHETHER OR NOT WE HAVE BEEN ADVISED OF
          THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p>
          Our aggregate liability arising out of or in connection with the Service shall not exceed
          the greater of the total amount paid by you to us in the twelve months preceding the event
          giving rise to the claim, or one hundred United States dollars.
        </p>
        <p>Consumers retain their statutory rights, which these terms do not affect.</p>
      </Clause>

      <Clause
        id="indemnity"
        title="11. Indemnity"
        plain={
          <p>
            If someone sues us because of the content in your library or what you did with the
            service, you cover our costs.
          </p>
        }
      >
        <p>
          You agree to indemnify and hold harmless NYX Services LLC, its members, officers, and
          contributors from any claim,
          demand, liability, damages, or expense, including reasonable legal fees, arising out of your
          use of the Service, your content, your library, your self-hosted deployment, or your breach
          of these terms or of any applicable law or third-party right.
        </p>
      </Clause>

      <Clause
        id="law"
        title="12. Governing law and disputes"
        plain={
          <p>
            Minnesota law applies and disputes go to Minnesota courts. Let us try to sort it out
            informally first &mdash; email{' '}
            <a href="mailto:legal@nyxservices.com">legal@nyxservices.com</a> and give us 30 days.
          </p>
        }
      >
        <p>
          These terms are governed by the laws of the State of Minnesota and the federal laws of the
          United States applicable therein, without regard to conflict of law principles. The state
          and federal courts located in Minnesota shall have exclusive jurisdiction over any dispute
          arising out of or in connection with these terms or the Service.
        </p>
        <p>
          Before commencing proceedings, you agree to attempt informal resolution by contacting{' '}
          <a href="mailto:legal@nyxservices.com">legal@nyxservices.com</a> and allowing thirty days
          for the matter to be addressed.
        </p>
        <p>
          Where you are a consumer resident outside Minnesota, you retain the benefit of any mandatory
          consumer protection provisions of the law of your country of residence.
        </p>
      </Clause>

      <Clause
        id="changes"
        title="13. Changes to these terms"
        plain={
          <p>
            These will change as the product matures. Material changes get announced. Continuing to
            use the service after that means you accept the new version.
          </p>
        }
      >
        <p>
          We may revise these terms as the Service develops. Where a revision is material, notice will
          be provided through the Service or the release changelog before it takes effect. Continued
          use of the Service following the effective date constitutes acceptance of the revised terms.
          If any provision is held unenforceable, the remainder continues in full force.
        </p>
      </Clause>

      <Clause
        id="contact"
        title="14. Contact"
        plain={
          <p>
            Legal matters: <a href="mailto:legal@nyxservices.com">legal@nyxservices.com</a>. Privacy
            matters: <a href="mailto:privacy@nyxservices.com">privacy@nyxservices.com</a>. Everything
            else is best on Discord or GitHub.
          </p>
        }
      >
        <p>
          The Service is operated by <strong>NYX Services LLC</strong>, a limited liability company
          organised under the laws of the State of Minnesota, United States. Enquiries concerning
          these terms may be directed to{' '}
          <a href="mailto:legal@nyxservices.com">legal@nyxservices.com</a>, and data protection
          matters to <a href="mailto:privacy@nyxservices.com">privacy@nyxservices.com</a>. A postal
          address for the company is available on request. General support enquiries may be raised
          through the community channels linked in the site footer.
        </p>
      </Clause>
    </LegalDoc>
  )
}

export default TermsPage
