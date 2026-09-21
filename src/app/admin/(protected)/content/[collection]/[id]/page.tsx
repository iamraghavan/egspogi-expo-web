import { notFound } from 'next/navigation';
import { authorize } from '@/lib/cms/auth';
import { isCollection } from '@/lib/cms/schema';
import { getDocument, revisions, CmsError } from '@/lib/cms/store';
import { ContentEditor } from '@/components/admin/ContentEditor';
export default async function EditorPage({
  params,
}: {
  params: Promise<{ collection: string; id: string }>;
}) {
  const admin = await authorize();
  const { collection, id } = await params;
  if (!isCollection(collection)) notFound();
  if (id === 'new') {
    if (collection === 'event') notFound();
    return (
      <ContentEditor
        key="new"
        collection={collection}
        initial={null}
        csrf={admin.csrf}
        history={[]}
      />
    );
  }
  if (!/^[a-f0-9-]{36}$/.test(id)) notFound();
  let doc, history;
  try {
    [doc, history] = await Promise.all([getDocument(collection, id), revisions(id)]);
  } catch (error) {
    if (error instanceof CmsError && error.status === 404) notFound();
    throw error;
  }
  return (
    <ContentEditor
      key={doc.id}
      collection={collection}
      initial={doc}
      csrf={admin.csrf}
      history={history}
    />
  );
}
