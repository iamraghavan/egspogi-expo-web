import { serviceClient } from '@/lib/cms/supabase';
import { failure, uuid } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/store';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    uuid(id);
    const { data, error } = await serviceClient()
      .from('expo_cms_media')
      .select('data_base64,mime')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new CmsError('Image service unavailable.', 503);
    if (!data) throw new CmsError('Image not found.', 404);
    return new Response(Buffer.from(data.data_base64, 'base64'), {
      headers: {
        'Content-Type': data.mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return failure(error);
  }
}
