import type { Metadata } from 'next';
import { Container, PageIntro } from '@/components/ui';
import { GalleryGrid } from '@/components/expo/GalleryGrid';
export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Explore the visual world of Science Expo 2026 through geometric illustrations of projects and experiences.',
};
import { getGallery } from '@/lib/cms/public';
export default async function Gallery() {
  const gallery = await getGallery();
  return (
    <>
      <PageIntro
        label="Gallery"
        title="A closer look at the experience."
        description="A visual space for projects, people and the work behind the scenes. Concept illustrations are labelled."
      />
      <section className="section">
        <Container>
          <GalleryGrid gallery={gallery} />
        </Container>
      </section>
    </>
  );
}
