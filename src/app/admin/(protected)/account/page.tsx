import { authorize } from '@/lib/cms/auth';
import { AccountForm } from '@/components/admin/AccountForm';
export default async function Account() {
  const admin = await authorize();
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">Private workspace</p>
          <h1>Account & security</h1>
          <p>Signed in as {admin.email}.</p>
        </div>
      </div>
      {admin.mustChangePassword && (
        <p className="admin-warning">
          Your initial password must be changed before you can edit or publish content.
        </p>
      )}
      <AccountForm csrf={admin.csrf} />
      <div className="admin-panel">
        <h2>Access management</h2>
        <p>
          Accounts are explicitly approved in Supabase. There is no public administrator signup. An
          operator can add a dedicated organiser account with the administrator creation command
          documented in the README.
        </p>
        <p className="admin-field-help">
          Sessions expire after eight hours. Disabling an account in the CMS administrator table
          immediately blocks its sessions.
        </p>
      </div>
    </>
  );
}
