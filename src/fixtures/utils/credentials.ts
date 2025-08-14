import { promises as fs } from 'fs';
import * as path from 'path';

export type UserCreds = { username: string; password: string };

// test-results/creds/last-user.json (kept out of git)
const CREDS_DIR = path.resolve(__dirname, '../../..');
const CREDS_FILE = path.join(CREDS_DIR, '.env');

export async function saveCreds(creds: UserCreds): Promise<void> {
  await fs.mkdir(CREDS_DIR, { recursive: true });
  await fs.writeFile(CREDS_FILE, JSON.stringify(creds, null, 2), 'utf-8');
}

export async function readCreds(): Promise<UserCreds | null> {
  try {
    const s = await fs.readFile(CREDS_FILE, 'utf-8');
    return JSON.parse(s) as UserCreds;
  } catch {
    return null;
  }
}