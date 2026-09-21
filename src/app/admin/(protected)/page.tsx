import Link from 'next/link';
import { CheckCircle2, Clock3, ArrowUpRight, AlertCircle } from 'lucide-react';
import { authorize } from '@/lib/cms/auth';
import { listDocuments, audit } from '@/lib/cms/store';
import { collections, definitions } from '@/lib/cms/schema';
export default async function Dashboard() {
  await authorize();
  const lists = await Promise.all(
    collections.map(async (c) => ({ collection: c, docs: await listDocuments(c) })),
  );
  const activity = await audit(6);
  const all = lists.flatMap((l) => l.docs);
  const teams = lists.find((l) => l.collection === 'teams')!.docs;
  const settings = lists.find((l) => l.collection === 'event')!.docs[0];
  const unverified = teams.filter((t) => !t.data.confirmed).length;
  const drafts = all.filter((d) => d.state === 'draft' || d.state === 'changes').length;
  const checks = [
    {
      label: 'Replace and verify sample help-desk contacts',
      done: teams.length > 0 && unverified === 0,
      href: '/admin/content/teams',
      note: `${unverified} teams still have unverified contacts`,
    },
    {
      label: 'Review event date, venue and desk hours',
      done: settings?.data.previewMode === false,
      href: '/admin/content/event',
      note: settings?.data.previewMode
        ? 'Preview notices are enabled'
        : 'Preview notices are disabled',
    },
    {
      label: 'Review drafts and unpublished changes',
      done: drafts === 0,
      href: '/admin/content/projects',
      note: `${drafts} entries need an editorial decision`,
    },
  ];
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Science Expo 2026 / Operations</p>
          <h1>Your expo, kept up to date.</h1>
          <p>Manage what visitors see. Registration stays at the campus help desk.</p>
        </div>
        <a className="admin-secondary" href="/" target="_blank" rel="noreferrer">
          View website <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="admin-stat-grid">
        <div>
          <span>Published entries</span>
          <strong>{all.filter((d) => d.publishedVersion && !d.archived).length}</strong>
          <p>Visible on the website</p>
        </div>
        <div>
          <span>Editorial queue</span>
          <strong>{drafts}</strong>
          <p>Drafts or unpublished edits</p>
        </div>
        <div>
          <span>Help-desk teams</span>
          <strong>{teams.length}</strong>
          <p>{unverified} awaiting contact verification</p>
        </div>
        <div>
          <span>Registration mode</span>
          <strong className="stat-word">Offline</strong>
          <p>No public registration form</p>
        </div>
      </div>
      <div className="admin-overview-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Publication readiness</h2>
            <span className="status-badge status-draft">Editorial checklist</span>
          </div>
          <p>A practical review list. It does not replace organiser approval.</p>
          {checks.map((check) => (
            <Link className="readiness-item" href={check.href} key={check.label}>
              {check.done ? <CheckCircle2 size={21} /> : <AlertCircle size={21} />}
              <span>
                <strong>{check.label}</strong>
                <small>{check.note}</small>
              </span>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </section>
        <section className="admin-panel">
          <h2>Useful actions</h2>
          <div className="admin-quick-links">
            <Link href="/admin/content/notices/new">
              Post a campus notice <ArrowUpRight size={18} />
            </Link>
            <Link href="/admin/content/schedule">
              Update the programme <ArrowUpRight size={18} />
            </Link>
            <Link href="/admin/content/teams">
              Update team contacts <ArrowUpRight size={18} />
            </Link>
            <a href="/api/admin/export" download>
              Export content & media <ArrowUpRight size={18} />
            </a>
          </div>
          <p className="admin-field-help">
            Exports contain content, images and revision history. Passwords, sessions and database
            credentials are excluded.
          </p>
        </section>
      </div>
      <div className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Content at a glance</h2>
        </div>
        <div className="admin-collection-grid">
          {lists.map(({ collection, docs }) => (
            <Link href={`/admin/content/${collection}`} key={collection}>
              <span>{definitions[collection].label}</span>
              <strong>{docs.filter((d) => !d.archived).length}</strong>
              <small>
                {docs.filter((d) => d.state === 'draft' || d.state === 'changes').length} in the
                editorial queue
              </small>
            </Link>
          ))}
        </div>
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <h2>Recent activity</h2>
          <Link className="text-link" href="/admin/activity">
            Full activity log →
          </Link>
        </div>
        {activity.length ? (
          activity.map((item) => (
            <div className="activity-row" key={item.id}>
              <Clock3 size={16} />
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.action} · {item.actor}
                </p>
              </div>
              <time dateTime={item.created_at}>
                {new Date(item.created_at).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
              </time>
            </div>
          ))
        ) : (
          <p>Editorial actions will appear here as your team starts working.</p>
        )}
      </section>
    </>
  );
}
