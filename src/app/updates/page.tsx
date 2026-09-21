import type { Metadata } from 'next';
import { Container, PageIntro, PreviewNote } from '@/components/ui';
import { UpdateCard } from '@/components/expo/content';
import { getUpdates } from '@/lib/cms/public';
export const metadata: Metadata = {
  title: 'Updates',
  description:
    'Read Science Expo announcements, participation guidance and visitor planning updates.',
};
export default async function Updates() {
  const updates = await getUpdates();
  return (
    <>
      <PageIntro
        label="Latest updates"
        title="From the organising desk."
        description="News, useful reminders and practical information for exhibitors and visitors."
      />
      <section className="section">
        <Container>
          <div className="updates-grid">
            {updates.map((update) => (
              <UpdateCard key={update.slug} update={update} />
            ))}
          </div>
          <PreviewNote>
            These sample announcements demonstrate the news section. Official announcements will be
            published after organiser review.
          </PreviewNote>
        </Container>
      </section>
    </>
  );
}
