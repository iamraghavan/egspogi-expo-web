import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { authorize } from '@/lib/cms/auth';
import { serviceClient } from '@/lib/cms/supabase';
import { CmsError } from '@/lib/cms/store';
import { json, readBytes, failure } from '@/lib/cms/http';
export const runtime = 'nodejs';
export async function GET() {
  try {
    await authorize();
    const { data, error } = await serviceClient()
      .from('expo_cms_media')
      .select('id,name,size,created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw new CmsError('Could not load media.', 503);
    return json({ media: data });
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    const admin = await authorize(request);
    const bytes = await readBytes(request, 3 * 1024 * 1024);
    const form = await new Response(bytes, {
      headers: { 'Content-Type': request.headers.get('content-type') || '' },
    }).formData();
    const file = form.get('file');
    if (!(file instanceof File) || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      throw new CmsError('Upload a JPG, PNG or WebP image up to 2 MB.', 422);
    if (file.size > 2 * 1024 * 1024) throw new CmsError('Images must be 2 MB or smaller.', 413);
    let output: Buffer;
    try {
      output = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 24_000_000 })
        .rotate()
        .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      throw new CmsError('This file is not a supported, valid image.', 422);
    }
    if (output.length > 1500000)
      throw new CmsError('This image remains too large after resizing.', 413);
    const id = randomUUID();
    const db = serviceClient();
    const { error } = await db.from('expo_cms_media').insert({
      id,
      name: file.name.slice(0, 160),
      mime: 'image/webp',
      data_base64: output.toString('base64'),
      size: output.length,
    });
    if (error) throw new CmsError('The image could not be stored.', 503);
    await db.from('expo_cms_audit').insert({
      action: 'upload',
      collection: 'media',
      document_id: id,
      title: file.name.slice(0, 160),
      actor: admin.email,
    });
    return json({ id, url: `/api/media/${id}` }, 201);
  } catch (error) {
    return failure(error);
  }
}
