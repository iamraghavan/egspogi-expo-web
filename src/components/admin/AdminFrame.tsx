'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { LayoutDashboard, ArrowUpRight, LogOut, ShieldCheck } from 'lucide-react';
import { collections, definitions } from '@/lib/cms/schema';
export function AdminFrame({
  children,
  email,
  csrf,
  mustChange,
}: {
  children: ReactNode;
  email: string;
  csrf: string;
  mustChange: boolean;
}) {
  const path = usePathname();
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="eyebrow">Organiser workspace</span>
          <strong>
            Expo control room<span>.</span>
          </strong>
        </Link>
        <nav aria-label="Admin navigation">
          <Link href="/admin" aria-current={path === '/admin' ? 'page' : undefined}>
            <LayoutDashboard size={17} />
            Overview
          </Link>
          {collections.map((c) => (
            <Link
              key={c}
              href={`/admin/content/${c}`}
              aria-current={path.startsWith(`/admin/content/${c}`) ? 'page' : undefined}
            >
              {definitions[c].label}
            </Link>
          ))}
          <div className="admin-nav-divider" />
          <Link href="/admin/media" aria-current={path === '/admin/media' ? 'page' : undefined}>
            Media library
          </Link>
          <Link
            href="/admin/activity"
            aria-current={path === '/admin/activity' ? 'page' : undefined}
          >
            Activity log
          </Link>
          <Link href="/admin/account" aria-current={path === '/admin/account' ? 'page' : undefined}>
            Account & security
          </Link>
        </nav>
        <a className="admin-view-site" href="/" target="_blank" rel="noreferrer">
          View public website <ArrowUpRight size={16} />
        </a>
      </aside>
      <div className="admin-workspace">
        <div className="admin-topbar">
          <span>
            <ShieldCheck size={17} /> Private workspace
          </span>
          <span className="admin-email">{email}</span>
          <button
            disabled={busy}
            type="button"
            onClick={async () => {
              setBusy(true);
              setError('');
              try {
                const response = await fetch('/api/admin/auth/logout', {
                  method: 'POST',
                  headers: { 'x-csrf-token': csrf },
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                router.push('/admin/login');
                router.refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Sign-out failed.');
              } finally {
                setBusy(false);
              }
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        {mustChange && (
          <p className="admin-warning">
            First sign-in: <Link href="/admin/account">change your initial password</Link> before
            editing content.
          </p>
        )}
        <div className="admin-content">{children}</div>
        <div className="admin-bottom-note">
          Offline registration only · Content publishing does not register participants.
        </div>
      </div>
    </div>
  );
}
