import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { defaultSite } from './default-site';

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

export async function getSite() { return readJson(sitePath, defaultSite); }
export async function saveSite(site) { await atomicWrite(sitePath, site); }
export async function getMessages() { return readJson(messagesPath, []); }
export async function saveMessages(messages) { await atomicWrite(messagesPath, messages); }
