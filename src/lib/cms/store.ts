import 'server-only';
import { randomUUID } from 'node:crypto';
import { serviceClient } from './supabase';
import {
  validateData,
  type Collection,
  type CmsDocument,
  type ContentData,
  type Intent,
} from './schema';
import { projects } from '@/data/projects';
import { updates } from '@/data/updates';
import { schedule } from '@/data/schedule';
import { gallery } from '@/data/gallery';
import { teams } from '@/data/teams';
import { faqs } from '@/data/faqs';
import { event } from '@/data/event';

export class CmsError extends Error {
  constructor(
    message: string,
    public status = 400,
    public fields?: Record<string, string>,
  ) {
    super(message);
  }
}
type Row = {
  id: string;
  collection: Collection;
  data: ContentData;
  version: number;
  published_version: number | null;
  archived: boolean;
  updated_at: string;
  published_data?: ContentData | null;
};
export function documentFromRow(row: Row): CmsDocument {
  return {
    id: row.id,
    collection: row.collection,
    data: row.data,
    version: row.version,
    publishedVersion: row.published_version,
    archived: row.archived,
    updatedAt: row.updated_at,
    state: row.archived
      ? 'archived'
      : row.published_version === row.version
        ? 'published'
        : row.published_version
          ? 'changes'
          : 'draft',
  };
}
const globalSeed = globalThis as typeof globalThis & { expoCmsSeed?: Promise<void> };
export async function ensureSeed() {
  if (!globalSeed.expoCmsSeed)
    globalSeed.expoCmsSeed = seed().catch((error) => {
      globalSeed.expoCmsSeed = undefined;
      throw error;
    });
  await globalSeed.expoCmsSeed;
}
async function seed() {
  const db = serviceClient();
  const existing = await db
    .from('expo_cms_meta')
    .select('value')
    .eq('key', 'content_seed_v1')
    .maybeSingle();
  if (existing.error) throw new CmsError('CMS database is not ready. Run npm run db:migrate.', 503);
  if (existing.data) return;
  // Stable UUIDs make initialization safe across concurrent serverless instances.
  const sources: Partial<Record<Collection, object[]>> = {
    projects: projects.map((p) => ({ ...p, sample: true })),
    updates,
    schedule: schedule.map((s) => ({ ...s, date: event.dateISO, sessionStatus: 'Scheduled' })),
    gallery: gallery.map((g) => ({
      ...g,
      alt: `${g.title} — geometric concept illustration`,
      illustration: true,
    })),
    teams,
    faqs,
    event: [{ ...event, dates: event.dates.map((d) => `${d.label} | ${d.value}`) }],
  };
  let index = 1;
  for (const [collection, items] of Object.entries(sources)) {
    const rows = items.map((item, order) => {
      const { data, errors } = validateData(collection as Collection, { ...item, order });
      if (Object.keys(errors).length)
        throw new Error(`Seed validation failed for ${collection}: ${JSON.stringify(errors)}`);
      const id = `00000000-0000-4000-8000-${String(index++).padStart(12, '0')}`;
      return {
        id,
        collection,
        slug: data.slug || null,
        data,
        published_data: data,
        version: 1,
        published_version: 1,
      };
    });
    const { error } = await db
      .from('expo_cms_documents')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: true });
    if (error) throw new CmsError('Could not initialize CMS content.', 503);
  }
  const { error } = await db
    .from('expo_cms_meta')
    .upsert({ key: 'content_seed_v1', value: 'complete' });
  if (error) throw new CmsError('Could not complete CMS initialization.', 503);
}
export async function listDocuments(collection: Collection) {
  await ensureSeed();
  const { data, error } = await serviceClient()
    .from('expo_cms_documents')
    .select('*')
    .eq('collection', collection)
    .order('updated_at', { ascending: false });
  if (error) throw new CmsError('Could not load content.', 503);
  return (data as Row[]).map(documentFromRow);
}
export async function getDocument(collection: Collection, id: string) {
  await ensureSeed();
  const { data, error } = await serviceClient()
    .from('expo_cms_documents')
    .select('*')
    .eq('id', id)
    .eq('collection', collection)
    .maybeSingle();
  if (error) throw new CmsError('Could not load content.', 503);
  if (!data) throw new CmsError('Content not found.', 404);
  return documentFromRow(data as Row);
}
export async function published<T>(collection: Collection): Promise<T[]> {
  await ensureSeed();
  const { data, error } = await serviceClient()
    .from('expo_cms_documents')
    .select('published_data')
    .eq('collection', collection)
    .eq('archived', false)
    .not('published_data', 'is', null);
  if (error) throw new CmsError('Could not load published content.', 503);
  return data
    .map((row) => row.published_data as ContentData)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)) as T[];
}
export async function saveDocument(
  collection: Collection,
  id: string | null,
  input: unknown,
  version: number,
  intent: Intent | 'restore',
  actor: string,
) {
  await ensureSeed();
  const { data, errors } = validateData(collection, input);
  if (Object.keys(errors).length) throw new CmsError('Check the highlighted fields.', 422, errors);
  if (!Number.isInteger(version) || version < 0)
    throw new CmsError('A valid content version is required.');
  // Reject unresolved media paths before publishing; only app-owned images are accepted.
  const image = String(data.image || data.src || '');
  if (image.startsWith('/api/media/')) {
    const { data: media } = await serviceClient()
      .from('expo_cms_media')
      .select('id')
      .eq('id', image.split('/').pop()!)
      .maybeSingle();
    if (!media)
      throw new CmsError('Select an existing uploaded image.', 422, {
        [collection === 'gallery' ? 'src' : 'image']: 'This uploaded image no longer exists.',
      });
  }
  if (intent === 'archive' || intent === 'unarchive') {
    if (!id) throw new CmsError('Save this document first.');
    const existing = await getDocument(collection, id);
    Object.assign(data, existing.data);
  }
  const { data: row, error } = await serviceClient().rpc('expo_cms_save', {
    p_id: id || randomUUID(),
    p_collection: collection,
    p_data: data,
    p_version: version,
    p_intent: intent,
    p_actor: actor,
  });
  if (error) {
    if (error.message.includes('VERSION_CONFLICT'))
      throw new CmsError(
        'Someone else changed this content. Reload the latest version before saving.',
        409,
      );
    if (error.code === '23505')
      throw new CmsError('This page address is already in use.', 409, {
        slug: 'Choose a unique address.',
      });
    if (error.message.includes('PUBLISHED_SLUG'))
      throw new CmsError(
        'Published page addresses cannot change. Create a new entry if a new address is needed.',
        422,
        { slug: 'Keep the original published address.' },
      );
    if (error.message.includes('EVENT'))
      throw new CmsError('The event settings entry cannot be duplicated or archived.', 409);
    if (error.message.includes('ARCHIVED'))
      throw new CmsError('Restore this archived entry before editing.', 409);
    throw new CmsError('The change could not be saved.', 500);
  }
  return documentFromRow(row as Row);
}
export async function revisions(id: string) {
  const { data, error } = await serviceClient()
    .from('expo_cms_revisions')
    .select('id,version,action,actor,created_at')
    .eq('document_id', id)
    .order('version', { ascending: false })
    .limit(30);
  if (error) throw new CmsError('Could not load revision history.', 503);
  return data;
}
export async function restoreRevision(
  collection: Collection,
  id: string,
  revisionId: string,
  version: number,
  actor: string,
) {
  const { data, error } = await serviceClient()
    .from('expo_cms_revisions')
    .select('data')
    .eq('id', revisionId)
    .eq('document_id', id)
    .maybeSingle();
  if (error || !data) throw new CmsError('Revision not found.', 404);
  return saveDocument(collection, id, data.data, version, 'restore', actor);
}
export async function audit(limit = 30) {
  const { data, error } = await serviceClient()
    .from('expo_cms_audit')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw new CmsError('Could not load activity.', 503);
  return data;
}
