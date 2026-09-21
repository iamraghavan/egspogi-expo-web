import type { Metadata } from 'next';
import { Container, PageIntro, Button, PreviewNote } from '@/components/ui';
import { FAQAccordion } from '@/components/expo/content';
import { getFaqs } from '@/lib/cms/public';
export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Answers to common questions about Science Expo participation, registration, categories and visitor support.',
};
export default async function FAQ() {
  const faqs = await getFaqs();
  return (
    <>
      <PageIntro
        label="Common questions"
        title="A little clarity before the day."
        description="Find useful answers about exhibiting, registration and visiting Science Expo 2026."
      />
      <section className="section">
        <Container>
          <div className="full-faq">
            <FAQAccordion items={faqs} />
            <PreviewNote />
            <div style={{ marginTop: 32 }}>
              <Button href="/contact" variant="outline">
                Contact the organisers
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
