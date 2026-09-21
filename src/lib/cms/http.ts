import { CmsError } from './store';
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
export function failure(error: unknown) {
  if (error instanceof CmsError)
    return json({ error: error.message, fields: error.fields }, error.status);
  console.error('CMS operation failed:', error instanceof Error ? error.name : 'Unknown error');
  return json({ error: 'The service could not complete this request. Please try again.' }, 500);
}
export async function readBytes(request: Request, max: number) {
  if (Number(request.headers.get('content-length') || 0) > max)
    throw new CmsError('This request is too large.', 413);
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > max) {
        await reader.cancel();
        throw new CmsError('This request is too large.', 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new CmsError('Use application/json.', 415);
  try {
    const data = JSON.parse(new TextDecoder().decode(await readBytes(request, 120000)));
    if (!data || typeof data !== 'object' || Array.isArray(data))
      throw new CmsError('A JSON object is required.');
    return data;
  } catch (error) {
    if (error instanceof CmsError) throw error;
    throw new CmsError('The JSON body is invalid.');
  }
}
export function uuid(value: string) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value))
    throw new CmsError('Content not found.', 404);
  return value;
}
