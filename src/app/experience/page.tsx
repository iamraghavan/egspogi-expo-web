import type { Metadata } from 'next';
import { Container, PageIntro } from '@/components/ui';
import { SciencePlayground } from '@/components/experience/SciencePlayground';
export const metadata: Metadata = {
  title: 'Science playground',
  description:
    'Explore signals, satellite orbits and airflow through three hands-on visual experiments.',
};
export default function ExperiencePage() {
  return (
    <>
      <PageIntro
        label="Science playground"
        title="A little change. A new perspective."
        description="Move a transmitter, trace an orbit or adjust a wing. Three small experiments to spark a question before your campus visit."
      />
      <section className="section">
        <Container>
          <SciencePlayground />
          <p className="small-note">
            These visual models illustrate ideas. They are not engineering simulations or
            measurements. All experiments support keyboard controls; motion is optional.
          </p>
        </Container>
      </section>
    </>
  );
}
