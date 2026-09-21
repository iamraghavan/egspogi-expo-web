import type { Metadata } from 'next';
import '@/styles/admin.css';
export const metadata: Metadata = {
  title: 'Organiser workspace',
  robots: { index: false, follow: false },
  referrer: 'same-origin',
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
