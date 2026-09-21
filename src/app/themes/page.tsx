import type { Metadata } from 'next';
import { Container, PageIntro } from '@/components/ui';
import { ThemeTile } from '@/components/expo/content';
import { themes } from '@/data/themes';
export const metadata: Metadata = {
  title: 'Expo themes',
  description:
    'Explore eight tracks across space, satellites, racing, aerodynamics, robotics, physics, mathematics and engineering.',
};
export default function Themes() {
  return (
    <>
      <PageIntro
        label="Expo themes"
        title="Different disciplines. Shared curiosity."
        description="Follow a familiar interest or find a completely new one. Each track offers a different way to understand the world."
      />
      <section className="section">
        <Container>
          <div className="theme-explorer">
            {themes.map((theme, index) => (
              <ThemeTile key={theme.category} theme={theme} index={index} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
