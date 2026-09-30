import { NextResponse } from 'next/server';
import { isAdmin } from '../../../../lib/auth';
import { getMessages } from '../../../../lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  return NextResponse.json(await getMessages(), { headers: { 'Cache-Control': 'no-store' } });
}
