import { authorize } from '@/lib/cms/auth';
import { serviceClient } from '@/lib/cms/supabase';
import { CmsError } from '@/lib/cms/store';
import { failure } from '@/lib/cms/http';
export async function GET() {
  try {
    await authorize();
    const db = serviceClient();
    const [docs, media, revisions] = await Promise.all([
      db.from('expo_cms_documents').select('*'),
      db.from('expo_cms_media').select('*'),
      db.from('expo_cms_revisions').select('*'),
    ]);
    if (docs.error || media.error || revisions.error)
      throw new CmsError('The export could not be completed.', 503);
    return new Response(
      JSON.stringify(
        {
          format: 'science-expo-cms-v1',
          exportedAt: new Date().toISOString(),
          documents: docs.data,
          media: media.data,
          revisions: revisions.data,
        },
        null,
        2,
      ),
      {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="science-expo-content-${new Date().toISOString().slice(0, 10)}.json"`,
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (error) {
    return failure(error);
  }
}
