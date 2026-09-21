'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push(data.redirect);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="admin-login-form">
      <label htmlFor="admin-email">Email address</label>
      <input
        id="admin-email"
        name="email"
        type="email"
        autoComplete="username"
        required
        maxLength={254}
      />
      <label htmlFor="admin-password">Password</label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        maxLength={128}
      />
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <button className="button button-primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in to the workspace'}
      </button>
      <p>
        Access is limited to authorised organisers. Participant registration takes place offline at
        the campus desk.
      </p>
    </form>
  );
}
