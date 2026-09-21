import { redirect } from 'next/navigation';
import { session } from '@/lib/cms/auth';
import { AdminFrame } from '@/components/admin/AdminFrame';
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await session();
  if (!admin) redirect('/admin/login');
  return (
    <AdminFrame email={admin.email} csrf={admin.csrf} mustChange={admin.mustChangePassword}>
      {children}
    </AdminFrame>
  );
}
