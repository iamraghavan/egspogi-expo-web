import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/cms/public';
import { Container, Breadcrumbs, Button, PreviewNote } from '@/components/ui';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((p) => p.slug === slug);
  return project
    ? { title: project.title, description: project.description }
    : { title: 'Project not found' };
}
export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = (await getProjects()).find((p) => p.slug === slug);
  if (!project) notFound();
  return (
    <section className="section">
      <Container>
        <Breadcrumbs
          items={[{ label: 'Projects & exhibits', href: '/projects' }, { label: project.title }]}
        />
        <p className="eyebrow">Student project / {project.category}</p>
        <h1 className="detail-title">{project.title}</h1>
        <div className="detail-meta">
          <span>{project.team}</span>
          <span>{project.institution}</span>
        </div>
        <Image
          className="detail-image"
          src={project.image}
          alt={
            project.sample ? `Geometric concept illustration for ${project.title}` : project.title
          }
          width={1200}
          height={650}
          priority
        />
        <div className="two-column">
          <div className="prose">
            <h2>The project</h2>
            <p>{project.description}</p>
            <h2>The problem</h2>
            <p>{project.problem}</p>
            <h2>The proposed solution</h2>
            <p>{project.solution}</p>
            <h2>Learning outcomes</h2>
            <p>{project.outcomes}</p>
            <Button href="/projects" variant="outline">
              Back to projects
            </Button>
          </div>
          <aside className="info-panel">
            <h2>Behind the build</h2>
            <dl>
              <dt>Team</dt>
              <dd>{project.team}</dd>
              <dt>{project.sample ? 'Team roles · names to be confirmed' : 'Team members'}</dt>
              <dd>{project.members.join(' · ')}</dd>
              <dt>Institution</dt>
              <dd>{project.institution}</dd>
              <dt>Technology used</dt>
              <dd>
                <ul className="tag-list">
                  {project.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          </aside>
        </div>
        {project.sample && (
          <PreviewNote>
            This is a sample project profile, not a confirmed exhibit. Artwork is conceptual;
            outcomes describe planned demonstrations rather than measured results.
          </PreviewNote>
        )}
      </Container>
    </section>
  );
}
