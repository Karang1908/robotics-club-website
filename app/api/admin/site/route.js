import { NextResponse } from 'next/server';
import { isAdmin, sameOrigin } from '../../../../lib/auth';
import { getSite, saveSite } from '../../../../lib/store';
import { validateSite } from '../../../../lib/site-validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  return NextResponse.json(await getSite(), { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const raw = await request.text();
  if (raw.length > 1_000_000) return NextResponse.json({ error: 'Site data is too large.' }, { status: 413 });
  let site;
  try { site = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const error = validateSite(site);
  if (error) return NextResponse.json({ error }, { status: 400 });
  await saveSite(site);
  return NextResponse.json({ ok: true });
}
