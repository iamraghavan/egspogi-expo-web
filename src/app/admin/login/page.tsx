import { redirect } from 'next/navigation';
import { session } from '@/lib/cms/auth';
import { LoginForm } from '@/components/admin/LoginForm';
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  if (await session()) redirect('/admin');
  const { changed } = await searchParams;
  return (
    <div className="admin-login-page">
      <div className="admin-login-art">
        <p className="eyebrow">EGS Pillay Group of Institutions</p>
        <h1>
          The people
          <br />
          behind the expo.
        </h1>
        <p>
          A shared workspace for keeping the programme, exhibits and visitor information up to date.
        </p>
        <div className="admin-art-blocks" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="admin-login-content">
        <p className="eyebrow">Organiser access</p>
        <h2>Welcome to the control room.</h2>
        {changed && (
          <p role="status" className="admin-success">
            Your password was changed. Sign in with your new password.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
