import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getDataDir } from '../../../../lib/store';

export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  const { name } = await params;
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp)$/.test(name)) return new Response('Not found', { status: 404 });
  const type = name.endsWith('.png') ? 'image/png' : name.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
  try {
    const buffer = await readFile(path.join(getDataDir(), 'media', name));
    return new Response(buffer, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch { return new Response('Not found', { status: 404 }); }
}
