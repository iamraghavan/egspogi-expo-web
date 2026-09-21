import type { Metadata } from 'next';
import { Container, PageIntro, Button } from '@/components/ui';
import { getTeams } from '@/lib/cms/public';
import { HelpTeamCard } from '@/components/expo/HelpTeamCard';
export const metadata: Metadata = {
  title: 'Help desk',
  description:
    'Find the Registration, Food & Accommodation, Venue, Technical and Visitor support teams for Science Expo 2026.',
};
export default async function HelpDesk() {
  const teams = await getTeams();
  return (
    <>
      <PageIntro
        label="Help desk"
        title="The right people. The right support."
        description="Find a dedicated team for registration, food and accommodation, the venue, technical support or your visit."
      />
      <section className="section">
        <Container>
          <div className="offline-callout">
            <div>
              <p className="eyebrow">Registration is offline only</p>
              <h2>Meet the registration team on campus.</h2>
              <p>
                Prepare your documents, check desk hours, and register in person. There is no online
                registration or payment form.
              </p>
            </div>
            <Button href="/help-desk/registration">Registration desk details</Button>
          </div>
          <div className="help-team-grid">
            {teams.map((team, index) => (
              <HelpTeamCard key={team.slug} team={team} index={index} />
            ))}
          </div>
          {!teams.length && <p>Help-desk contacts will be published shortly.</p>}
        </Container>
      </section>
    </>
  );
}
