import { authorize } from '@/lib/cms/auth';
import { isCollection } from '@/lib/cms/schema';
import { listDocuments, saveDocument, CmsError } from '@/lib/cms/store';
import { json, readJson, failure } from '@/lib/cms/http';
type Context = { params: Promise<{ collection: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    await authorize();
    const { collection } = await params;
    if (!isCollection(collection)) throw new CmsError('Collection not found.', 404);
    return json({ documents: await listDocuments(collection) });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    const admin = await authorize(request);
    const { collection } = await params;
    if (!isCollection(collection)) throw new CmsError('Collection not found.', 404);
    const body = await readJson(request);
    if (!['draft', 'publish'].includes(String(body.intent)))
      throw new CmsError('Choose draft or publish.');
    return json(
      {
        document: await saveDocument(
          collection,
          null,
          body.data,
          0,
          body.intent as 'draft' | 'publish',
          admin.email,
        ),
      },
      201,
    );
  } catch (error) {
    return failure(error);
  }
}
