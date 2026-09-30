import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { getDataDir } from '../../../../lib/store';
import { isAdmin, sameOrigin } from '../../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const form = await request.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file.arrayBuffer !== 'function' || file.size > 5_000_000 || file.size === 0) return NextResponse.json({ error: 'Choose an image under 5 MB.' }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  let extension;
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) extension = 'jpg';
  else if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) extension = 'png';
  else if (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP') extension = 'webp';
  else return NextResponse.json({ error: 'Only JPEG, PNG or WebP images are supported.' }, { status: 400 });
  const name = `${randomUUID()}.${extension}`;
  const directory = path.join(getDataDir(), 'media');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), buffer, { flag: 'wx', mode: 0o644 });
  return NextResponse.json({ url: `/api/media/${name}` });
}
