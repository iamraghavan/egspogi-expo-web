import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Breadcrumbs, Button } from '@/components/ui';
import { getTeams, getEvent } from '@/lib/cms/public';
import { TeamContact } from '@/components/expo/HelpTeamCard';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = (await getTeams()).find((t) => t.slug === slug);
  return { title: team?.title || 'Help desk', description: team?.description };
}
export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [teams, event] = await Promise.all([getTeams(), getEvent()]);
  const team = teams.find((t) => t.slug === slug);
  if (!team) notFound();
  return (
    <section className="section">
      <Container>
        <Breadcrumbs items={[{ label: 'Help desk', href: '/help-desk' }, { label: team.title }]} />
        <p className="eyebrow">People behind the expo</p>
        <h1 className="detail-title">{team.title}</h1>
        <p className="lead mb-10">{team.description}</p>
        <div className="two-column">
          <div className="prose">
            <h2>How we can help</h2>
            <ul>
              {team.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {team.bring.length > 0 && (
              <>
                <h2>Before you contact us</h2>
                <ul>
                  {team.bring.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            {slug === 'registration' && (
              <div className="registration-panel">
                <h2>Offline registration only</h2>
                <p>
                  Visit the designated registration desk in person. This website does not accept
                  registration submissions or payments.
                </p>
                <p>
                  <strong>Desk:</strong> {event.offlineDesk}
                  <br />
                  <strong>Hours:</strong> {event.offlineHours}
                </p>
                <h3>Bring with you</h3>
                <ul>
                  {event.offlineRequirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="text-link" href="/downloads/exhibitor-guidelines.txt" download>
                  Download the preparation checklist
                </a>
              </div>
            )}
            {slug === 'food-accommodation' && (
              <p className="dummy-note">
                Meals and accommodation depend on confirmed event arrangements. Contact details and
                availability must be verified before making travel plans.
              </p>
            )}
            <Button href="/help-desk" variant="outline">
              All help-desk teams
            </Button>
          </div>
          <aside className="info-panel">
            <h2>Your team contact</h2>
            <TeamContact team={team} />
          </aside>
        </div>
      </Container>
    </section>
  );
}
