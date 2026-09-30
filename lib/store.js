import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { defaultSite } from './default-site';
import { supabase, readDocument, writeDocument } from './supabase';

const dataDir = path.resolve(process.env.DATA_DIR || './storage');
const sitePath = path.join(dataDir, 'site.json');
const messagesPath = path.join(dataDir, 'messages.json');

export function getDataDir() { return dataDir; }

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

async function atomicWrite(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temp, file);
}

export async function getSite() {
  if (supabase) return (await readDocument('site')) ?? defaultSite;
  return readJson(sitePath, defaultSite);
}

export async function saveSite(site) {
  if (supabase) return writeDocument('site', site);
  await atomicWrite(sitePath, site);
}

export async function getMessages() {
  if (supabase) {
    const { data, error } = await supabase.from('contact_messages').select('id, name, email, message, created_at').order('created_at', { ascending: false }).limit(1000);
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return data.map(({ created_at, ...message }) => ({ ...message, date: created_at }));
  }
  return readJson(messagesPath, []);
}

export async function addMessage(message) {
  if (supabase) {
    const { error } = await supabase.from('contact_messages').insert({ id: message.id, name: message.name, email: message.email, message: message.message, created_at: message.date });
    if (error) throw new Error(`Supabase write failed: ${error.message}`);
    return;
  }
  const messages = await readJson(messagesPath, []);
  messages.unshift(message);
  await atomicWrite(messagesPath, messages.slice(0, 1000));
}
