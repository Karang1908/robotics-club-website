import { createClient } from '@supabase/supabase-js';

// Server-only Supabase client. When SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
// (e.g. on Vercel), content, the admin account, messages and images are stored in Supabase.
// Without them the site falls back to files in DATA_DIR, which is fine for local development.
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = url && key
  ? createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
    })
  : null;

export const MEDIA_BUCKET = 'media';

// Reads one JSON document ('site' or 'auth') from the site_store table.
export async function readDocument(name) {
  const { data, error } = await supabase.from('site_store').select('value').eq('key', name).maybeSingle();
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  return data ? data.value : null;
}

export async function writeDocument(name, value) {
  const { error } = await supabase.from('site_store').upsert({ key: name, value, updated_at: new Date().toISOString() });
  if (error) throw new Error(`Supabase write failed: ${error.message}`);
}
