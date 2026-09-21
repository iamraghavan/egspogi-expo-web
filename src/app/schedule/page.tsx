import type { Metadata } from 'next';
import { Container, PageIntro, PreviewNote } from '@/components/ui';
import { ScheduleProgramme } from '@/components/expo/ScheduleProgramme';
import { getSchedule, getEvent } from '@/lib/cms/public';
export const metadata: Metadata = {
  title: 'Schedule',
  description:
    'Plan your expo day with the proposed programme of exhibits, demonstrations and student showcases.',
};
export default async function Schedule() {
  const [schedule, event] = await Promise.all([getSchedule(), getEvent()]);
  return (
    <>
      <PageIntro
        label="Programme"
        title="A day to look a little closer."
        description="Take your time with the exhibits, make space for a demonstration and hear the thinking behind student projects."
      />
      <section className="section">
        <Container>
          <div className="schedule-heading">
            <h2>Programme</h2>
            <p>All times in Indian Standard Time (IST)</p>
          </div>
          <ScheduleProgramme sessions={schedule} />
          <PreviewNote>
            The proposed programme runs from {event.time}. Sessions, locations and timings may
            change before organiser confirmation.
          </PreviewNote>
        </Container>
      </section>
    </>
  );
}
