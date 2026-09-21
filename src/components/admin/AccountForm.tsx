'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
export function AccountForm({ csrf }: { csrf: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    if (form.get('password') !== form.get('confirm')) {
      setError('The new passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/admin/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        body: JSON.stringify({ current: form.get('current'), password: form.get('password') }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push('/admin/login?changed=1');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Password change failed.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="admin-panel admin-account-form">
      <h2>Change your password</h2>
      <p>
        Use at least 14 characters. Changing your password signs out every CMS session, including
        this one.
      </p>
      <label htmlFor="current">Current password</label>
      <input
        id="current"
        name="current"
        type="password"
        autoComplete="current-password"
        required
        maxLength={128}
      />
      <label htmlFor="new-password">New password</label>
      <input
        id="new-password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={14}
        maxLength={128}
      />
      <label htmlFor="confirm-password">Confirm new password</label>
      <input
        id="confirm-password"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        minLength={14}
        maxLength={128}
      />
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      <button disabled={busy} className="button button-primary">
        {busy ? 'Updating…' : 'Update password & sign out'}
      </button>
    </form>
  );
}
