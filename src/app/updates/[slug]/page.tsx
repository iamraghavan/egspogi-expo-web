import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getUpdates } from '@/lib/cms/public';
import { Container, Breadcrumbs, Button, PreviewNote } from '@/components/ui';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const update = (await getUpdates()).find((u) => u.slug === slug);
  return update
    ? { title: update.title, description: update.excerpt }
    : { title: 'Update not found' };
}
export default async function UpdateDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = (await getUpdates()).find((u) => u.slug === slug);
  if (!update) notFound();
  return (
    <section className="section">
      <Container>
        <article className="prose article-content">
          <Breadcrumbs items={[{ label: 'Updates', href: '/updates' }, { label: update.title }]} />
          <div className="update-meta">
            <span>{update.category}</span>
            <time dateTime={update.date}>
              {new Date(update.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          </div>
          <h1>{update.title}</h1>
          <p className="lead">{update.excerpt}</p>
          {update.content.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <PreviewNote>Sample editorial content for the website preview.</PreviewNote>
          <Button href="/updates" variant="outline">
            Back to updates
          </Button>
        </article>
      </Container>
    </section>
  );
}
