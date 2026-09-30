import { randomBytes, scrypt as callbackScrypt, createHmac, timingSafeEqual } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { getDataDir } from './store';

const scrypt = promisify(callbackScrypt);
const authPath = path.join(getDataDir(), 'auth.json');
export const cookieName = 'bpdc_rc_session';

export async function getAuthRecord() {
  try { return JSON.parse(await readFile(authPath, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export async function createAdmin(username, password) {
  if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) throw new Error('Use a username of 3–40 letters, numbers, dots, dashes or underscores.');
  if (password.length < 12 || password.length > 200) throw new Error('Use a password of at least 12 characters.');
  await mkdir(getDataDir(), { recursive: true });
  const salt = randomBytes(24).toString('hex');
  const hash = (await scrypt(password, salt, 64)).toString('hex');
  const record = { username, salt, hash, secret: randomBytes(32).toString('hex') };
  await writeFile(authPath, JSON.stringify(record), { flag: 'wx', mode: 0o600 });
  return record;
}

export async function verifyPassword(username, password) {
  const record = await getAuthRecord();
  if (!record || typeof username !== 'string' || typeof password !== 'string' || username !== record.username) return null;
  const actual = await scrypt(password, record.salt, 64);
  const expected = Buffer.from(record.hash, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected) ? record : null;
}

export function makeSession(record) {
  const payload = Buffer.from(JSON.stringify({ u: record.username, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = createHmac('sha256', record.secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export async function isAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  const record = await getAuthRecord();
  if (!record) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = createHmac('sha256', record.secret).update(payload).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.u === record.username && Number.isFinite(data.exp) && data.exp > Date.now();
  } catch { return false; }
}

export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const url = new URL(request.url);
  const expected = process.env.SITE_ORIGIN || `${url.protocol}//${request.headers.get('host') || url.host}`;
  return origin === expected;
}
