import type { Metadata } from 'next';
import { Container, PageIntro, PreviewNote } from '@/components/ui';
import { ContactForm } from '@/components/expo/ContactForm';
import { getEvent } from '@/lib/cms/public';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Contact',
  description: 'Find organiser information and prepare an enquiry about Science Expo 2026.',
};
export default async function Contact() {
  const event = await getEvent();
  return (
    <>
      <PageIntro
        label="Contact"
        title="Let’s talk about the expo."
        description="Questions about your project, a group visit or access needs? Start with the organising team."
      />
      <section className="section">
        <Container>
          <div className="two-column">
            <div className="contact-details">
              <h2>Science Expo organising team</h2>
              <p>{event.organizer}</p>
              <dl>
                <dt>Email · placeholder</dt>
                <dd>{event.email}</dd>
                <dt>Telephone</dt>
                <dd>{event.phone}</dd>
                <dt>Campus address</dt>
                <dd>{event.address}</dd>
                <dt>Institution website</dt>
                <dd>
                  <a href={event.institutionUrl} target="_blank" rel="noreferrer">
                    EGS Pillay Engineering College ↗
                  </a>
                </dd>
              </dl>
              <PreviewNote>
                Verified expo contacts are not yet configured. The sample email is not a working
                contact address.
              </PreviewNote>
            </div>
            <div>
              <Link href="/help-desk" className="button button-primary mb-6">
                Find the right help-desk team
              </Link>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
