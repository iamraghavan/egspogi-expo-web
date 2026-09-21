import { authorize } from '@/lib/cms/auth';
import { isCollection, type Intent } from '@/lib/cms/schema';
import { getDocument, saveDocument, CmsError, revisions, restoreRevision } from '@/lib/cms/store';
import { json, readJson, failure, uuid } from '@/lib/cms/http';
type Context = { params: Promise<{ collection: string; id: string }> };
export async function GET(request: Request, { params }: Context) {
  try {
    await authorize();
    const { collection, id } = await params;
    if (!isCollection(collection)) throw new CmsError('Collection not found.', 404);
    uuid(id);
    return json({ document: await getDocument(collection, id), revisions: await revisions(id) });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    const admin = await authorize(request);
    const { collection, id } = await params;
    if (!isCollection(collection)) throw new CmsError('Collection not found.', 404);
    uuid(id);
    const body = await readJson(request);
    if (typeof body.version !== 'number') throw new CmsError('A content version is required.');
    if (body.intent === 'restore') {
      uuid(String(body.revision));
      return json({
        document: await restoreRevision(
          collection,
          id,
          String(body.revision),
          body.version,
          admin.email,
        ),
      });
    }
    if (!['draft', 'publish', 'archive', 'unarchive'].includes(String(body.intent)))
      throw new CmsError('Unknown action.');
    return json({
      document: await saveDocument(
        collection,
        id,
        body.data,
        body.version,
        body.intent as Intent,
        admin.email,
      ),
    });
  } catch (error) {
    return failure(error);
  }
}
