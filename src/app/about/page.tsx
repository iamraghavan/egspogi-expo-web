import type { Metadata } from 'next';
import { Container, PageIntro, Button, PreviewNote } from '@/components/ui';
import { GeometricScienceArtwork } from '@/components/expo/GeometricScienceArtwork';
export const metadata: Metadata = {
  title: 'About the expo',
  description:
    'Discover the student-led ideas, hands-on learning and eight science tracks behind Science Expo 2026.',
};
export default function About() {
  return (
    <>
      <PageIntro
        label="About the expo"
        title="Science starts with a question."
        description="A campus-wide invitation to explore, experiment and learn from one another."
      />
      <section className="section">
        <Container>
          <div className="two-column">
            <div className="prose">
              <h2>A meeting place for curious minds</h2>
              <p>
                Science Expo 2026 by EGS Pillay Group of Institutions brings student thinking into
                the open. It is a place to see how an idea moves from a sketch to a prototype, and
                how testing changes what we understand.
              </p>
              <p>
                Across eight science and engineering tracks, students can share working models,
                explain their methods and learn from visitors, teachers and fellow exhibitors.
              </p>
              <h2>Learning you can get close to</h2>
              <p>
                The proposed programme combines an open exhibition, live demonstrations and a
                student innovation showcase. Visitors are encouraged to ask questions about the
                decisions, challenges and discoveries behind each project.
              </p>
              <h2>Built around student work</h2>
              <p>
                The emphasis is on clear thinking, careful experimentation and honest evidence. A
                useful prototype need not be elaborate: it should explain a meaningful problem and
                show what the team has learned.
              </p>
              <Button href="/themes">Explore the eight tracks</Button>
            </div>
            <div>
              <GeometricScienceArtwork />
              <div className="info-panel">
                <h2>At the heart of the expo</h2>
                <ul>
                  <li>Eight connected science tracks</li>
                  <li>Student-led projects and prototypes</li>
                  <li>Live demonstrations and conversations</li>
                  <li>A welcoming environment for visitors</li>
                </ul>
              </div>
            </div>
          </div>
          <PreviewNote />
        </Container>
      </section>
    </>
  );
}
