import { Container, Button } from '@/components/ui';
export default function NotFound() {
  return (
    <Container>
      <div className="error-page">
        <p className="eyebrow">404 / A small detour</p>
        <h1>This page isn’t on the programme.</h1>
        <p>The address may have changed. Let’s get you back to the expo.</p>
        <Button href="/">Back to the expo</Button>
      </div>
    </Container>
  );
}
