import { isCollection } from '@/lib/cms/schema';
import { published, CmsError } from '@/lib/cms/store';
import { json, failure } from '@/lib/cms/http';
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  try {
    const { collection } = await params;
    if (!isCollection(collection)) throw new CmsError('Collection not found.', 404);
    return json({ data: await published(collection), registrationMode: 'offline' });
  } catch (error) {
    return failure(error);
  }
}
