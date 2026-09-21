import { notFound } from 'next/navigation';
import { authorize } from '@/lib/cms/auth';
import { isCollection } from '@/lib/cms/schema';
import { listDocuments } from '@/lib/cms/store';
import { ContentList } from '@/components/admin/ContentList';
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  await authorize();
  const { collection } = await params;
  if (!isCollection(collection)) notFound();
  return <ContentList collection={collection} documents={await listDocuments(collection)} />;
}
