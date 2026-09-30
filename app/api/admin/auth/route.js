import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { createAdmin, getAuthRecord, isAdmin, makeSession, verifyPassword, cookieName, sameOrigin } from '../../../../lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const attempts = new Map();

export async function GET() {
  return NextResponse.json({ configured: Boolean(await getAuthRecord()), authenticated: await isAdmin(), setupReady: Boolean(process.env.ADMIN_SETUP_TOKEN && process.env.ADMIN_SETUP_TOKEN.length >= 24) }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body.action !== 'string') return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  if (body.action === 'logout') {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieName, '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'strict' });
    return response;
  }
  if (typeof body.username !== 'string' || typeof body.password !== 'string') return NextResponse.json({ error: 'Enter a username and password.' }, { status: 400 });
  try {
    let record;
    if (body.action === 'setup') {
      if (await getAuthRecord()) return NextResponse.json({ error: 'Admin setup is already complete.' }, { status: 409 });
      const expected = process.env.ADMIN_SETUP_TOKEN;
      if (!expected || expected.length < 24) return NextResponse.json({ error: 'Set a long ADMIN_SETUP_TOKEN on the server before creating an account.' }, { status: 503 });
      const entered = typeof body.setupToken === 'string' ? body.setupToken : '';
      const a = Buffer.from(entered); const b = Buffer.from(expected);
      if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'Invalid setup key.' }, { status: 403 });
      record = await createAdmin(body.username.trim(), body.password);
    } else if (body.action === 'login') {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
      const now = Date.now();
      const current = attempts.get(ip) || { count: 0, since: now };
      if (now - current.since > 15 * 60 * 1000) { current.count = 0; current.since = now; }
      if (current.count >= 8) return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
      record = await verifyPassword(body.username.trim(), body.password);
      if (!record) {
        current.count += 1; attempts.set(ip, current);
        return NextResponse.json({ error: 'Incorrect username or password.' }, { status: 401 });
      }
      attempts.delete(ip);
    } else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieName, makeSession(record), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 7 * 24 * 60 * 60 });
    return response;
  } catch (error) {
    if (error.code === 'EEXIST') return NextResponse.json({ error: 'Admin setup is already complete.' }, { status: 409 });
    return NextResponse.json({ error: error.message || 'Unable to authenticate.' }, { status: 400 });
  }
}
