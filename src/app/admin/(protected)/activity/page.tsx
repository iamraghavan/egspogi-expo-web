import { authorize } from '@/lib/cms/auth';
import { audit } from '@/lib/cms/store';
export default async function Activity() {
  await authorize();
  const entries = await audit(100);
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Accountability</p>
          <h1>Activity log</h1>
          <p>The most recent 100 editorial and account actions, recorded by the server.</p>
        </div>
        <a className="admin-secondary" href="/api/admin/export" download>
          Export content & media
        </a>
      </div>
      <div className="admin-panel">
        {entries.length ? (
          entries.map((entry) => (
            <div className="activity-row" key={entry.id}>
              <span className="status-badge">{entry.action}</span>
              <div>
                <strong>{entry.title}</strong>
                <p>
                  {entry.collection} · {entry.actor}
                </p>
              </div>
              <time dateTime={entry.created_at}>
                {new Date(entry.created_at).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' })}{' '}
                IST
              </time>
            </div>
          ))
        ) : (
          <p>No activity recorded yet.</p>
        )}
      </div>
    </>
  );
}
