import Link from 'next/link';
import { Info } from 'lucide-react';
import { getNotices } from '@/lib/cms/public';
import { Container } from '@/components/ui';
export async function LiveNotices() {
  const notices = await getNotices();
  if (!notices.length) return null;
  return (
    <aside className="live-notices" aria-label="Event notices">
      <Container>
        {notices.map((notice) => (
          <div
            key={notice.title}
            className={notice.level === 'Important' ? 'important-notice' : ''}
          >
            <Info size={18} aria-hidden="true" />
            <p>
              <strong>{notice.title}</strong> {notice.message}{' '}
              {notice.href && <Link href={notice.href}>View details →</Link>}
            </p>
          </div>
        ))}
      </Container>
    </aside>
  );
}
