import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { addMessage } from '../../../lib/store';
import { sameOrigin } from '../../../lib/auth';

export const runtime = 'nodejs';
const lastRequest = new Map();

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || body.website) return NextResponse.json({ ok: true });
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200 || message.length < 5 || message.length > 5000) return NextResponse.json({ error: 'Enter your name, a valid email and a message of at least 5 characters.' }, { status: 400 });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  if (now - (lastRequest.get(ip) || 0) < 30_000) return NextResponse.json({ error: 'Please wait a moment before sending another message.' }, { status: 429 });
  lastRequest.set(ip, now);
  await addMessage({ id: randomUUID(), name, email, message, date: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
