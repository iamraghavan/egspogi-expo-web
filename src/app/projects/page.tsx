import type { Metadata } from 'next';
import { Container, PageIntro, PreviewNote } from '@/components/ui';
import { ProjectFilter } from '@/components/expo/ProjectFilter';
import { themes } from '@/data/themes';
export const metadata: Metadata = {
  title: 'Projects & exhibits',
  description: 'Search student projects and filter exhibits across eight Science Expo tracks.',
};
import { getProjects } from '@/lib/cms/public';
export default async function Projects({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const projects = await getProjects();
  const initial = themes.some((t) => t.category === category) ? category : 'All';
  return (
    <>
      <PageIntro
        label="Projects & exhibits"
        title="Meet the ideas taking shape."
        description="Explore prototypes, working models and experiments from student teams. Search for an idea or browse by science track."
      />
      <section className="section">
        <Container>
          <ProjectFilter key={initial} initialCategory={initial} projects={projects} />
          <PreviewNote>
            All exhibits and team details are illustrative sample content. Confirmed projects will
            replace these entries after selection.
          </PreviewNote>
        </Container>
      </section>
    </>
  );
}
