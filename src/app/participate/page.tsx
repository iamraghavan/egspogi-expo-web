import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, ArrowUpRight } from 'lucide-react';
import { Container, PageIntro, PreviewNote } from '@/components/ui';
import { getEvent } from '@/lib/cms/public';
import { themes } from '@/data/themes';
export const metadata: Metadata = {
  title: 'Participate',
  description:
    'Prepare your student exhibit: eligibility, team rules, project categories, important dates and draft submission guidelines.',
};
export default async function Participate() {
  const event = await getEvent();
  return (
    <>
      <PageIntro
        label="Participation"
        title="Bring an idea. Start a conversation."
        description="Share a prototype, demonstrate an experiment or show a new way to solve a familiar problem."
      />
      <section className="section">
        <Container>
          <div className="two-column">
            <div className="prose">
              <h2>Who can participate?</h2>
              <p>
                The proposed programme welcomes school, diploma, undergraduate and postgraduate
                students. Teams should work with a faculty mentor and be ready to explain the
                thinking behind their work.
              </p>
              <h2>Eligibility & team rules</h2>
              <ul>
                <li>Draft team size: 2–4 students, with one nominated team contact.</li>
                <li>
                  Submit original work and acknowledge external tools, datasets and references.
                </li>
                <li>Choose one main project per team and a primary exhibition category.</li>
                <li>
                  At least one team member should remain with the exhibit during opening hours.
                </li>
              </ul>
              <h2>What can be exhibited?</h2>
              <p>
                Working prototypes, physical models, software demonstrations and structured
                scientific experiments are welcome. Present evidence, explain limitations and
                distinguish tested results from future plans.
              </p>
              <ul className="tag-list">
                {themes.map((t) => (
                  <li key={t.category}>{t.category}</li>
                ))}
              </ul>
              <h2>Submission requirements</h2>
              <ul>
                <li>A 200–300 word abstract describing the problem and proposed solution.</li>
                <li>Team details, institution and faculty mentor contact.</li>
                <li>A project image or diagram and a short demonstration plan.</li>
                <li>Space, power, internet and safety requirements.</li>
              </ul>
              <h2>Judging criteria</h2>
              <p>
                The draft criteria consider scientific understanding, originality, practical
                execution, testing and communication. Teams should be able to explain both what
                worked and what they would improve.
              </p>
              <h2>Downloads</h2>
              <a className="text-link" href="/downloads/exhibitor-guidelines.txt" download>
                <Download size={18} />
                Download draft exhibitor guidelines (.txt)
              </a>
              <div id="registration" className="registration-panel">
                <h2>Offline registration</h2>
                <p>
                  <strong>{event.registration}.</strong> There is no online registration form, link
                  or payment for this expo. Bring your team, ID and printed abstract to the
                  registration desk on campus during the announced hours.
                </p>
                <p>
                  <strong>Desk:</strong> {event.offlineDesk}
                  <br />
                  <strong>Hours:</strong> {event.offlineHours}
                </p>
                <ul>
                  {event.offlineRequirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href="/help-desk/registration" className="button button-primary">
                  Registration desk details <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
            <aside className="info-panel" id="dates">
              <p className="eyebrow">Plan your submission</p>
              <h2>Important dates</h2>
              <ul className="date-list">
                {event.dates.map((d) => (
                  <li key={d.label}>
                    <span>{d.label}</span>
                    <strong>{d.value}</strong>
                  </li>
                ))}
              </ul>
              <p>These are proposed dates, subject to organiser approval.</p>
              <h2 style={{ marginTop: 32 }}>A safe exhibition</h2>
              <p>
                Declare batteries, moving parts, chemicals, heat sources and any specialist
                equipment. Live demonstrations require the organising team’s approval.
              </p>
              <Link href="/contact" className="text-link">
                Ask the organising team <ArrowUpRight size={16} />
              </Link>
            </aside>
          </div>
          <PreviewNote>
            Eligibility, dates, team size and judging criteria are draft guidance. Final
            participation terms and offline desk hours will be published after organiser
            confirmation.
          </PreviewNote>
        </Container>
      </section>
    </>
  );
}
