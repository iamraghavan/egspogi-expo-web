'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container error-page">
      <h1>Something interrupted your visit.</h1>
      <p>Please try loading this page again.</p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
