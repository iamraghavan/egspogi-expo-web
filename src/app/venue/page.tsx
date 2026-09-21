import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { Container, PageIntro, PreviewNote } from '@/components/ui';
import { VenueMap } from '@/components/expo/content';
import { getEvent } from '@/lib/cms/public';
export const metadata: Metadata = {
  title: 'Venue & directions',
  description: 'Plan your visit to EGS Pillay Campus in Nagapattinam, Tamil Nadu.',
};
export default async function Venue() {
  const event = await getEvent();
  return (
    <>
      <PageIntro
        label="Venue & directions"
        title="We’ll meet you on campus."
        description="Plan your visit to EGS Pillay Group of Institutions in Nagapattinam, Tamil Nadu."
      />
      <section className="section">
        <Container>
          <div className="venue-grid">
            <div className="prose">
              <h2>{event.venue}</h2>
              <p>{event.address}</p>
              <p>
                <strong>Proposed event date:</strong> {event.date}
                <br />
                <strong>Opening hours:</strong> {event.time}
              </p>
              <a
                href={event.directionsUrl}
                className="button button-primary"
                target="_blank"
                rel="noreferrer"
              >
                Get directions <ArrowUpRight size={18} />
              </a>
            </div>
            <VenueMap />
          </div>
          <div className="two-column" style={{ marginTop: 48 }}>
            <div className="prose">
              <h2>Arriving at the expo</h2>
              <p>
                Use the campus location to plan your journey. The designated entry gate, parking
                area and visitor check-in point will be published before the event.
              </p>
              <h2>Visiting with a group</h2>
              <p>
                School and college groups should travel with an accompanying teacher or faculty
                member. Contact the organising team once verified contact details are available to
                discuss group arrangements.
              </p>
            </div>
            <div className="info-panel">
              <h2>Access & assistance</h2>
              <p>
                Step-free routes, accessible facilities and support arrangements are being
                confirmed. Please check the contact page before making travel arrangements if you
                have specific access requirements.
              </p>
              <p>
                The marker shows the confirmed campus location. Exact desk, entry-gate and parking
                positions will be added after verification.
              </p>
            </div>
          </div>
          <PreviewNote />
        </Container>
      </section>
    </>
  );
}
