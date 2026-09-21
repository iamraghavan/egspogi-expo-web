import { authorize } from '@/lib/cms/auth';
import { serviceClient } from '@/lib/cms/supabase';
import { CmsError } from '@/lib/cms/store';
import { MediaLibrary } from '@/components/admin/MediaLibrary';
export default async function Media() {
  const admin = await authorize();
  const { data, error } = await serviceClient()
    .from('expo_cms_media')
    .select('id,name,size,created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new CmsError('Could not load the media library.', 503);
  return <MediaLibrary csrf={admin.csrf} media={data} />;
}
