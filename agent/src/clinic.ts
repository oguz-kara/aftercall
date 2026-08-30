// src/clinic.ts — clinic knowledge + call/appointment stores.
// The clinic config lives in ../data/clinic.md (fictional demo clinic);
// stores are JSON files under ../data/out (v1 pattern, DB later).
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), '..');
const OUT = path.join(ROOT, 'data', 'out');

export async function loadClinicConfig(): Promise<string> {
  return fs.readFile(path.join(ROOT, 'data', 'clinic.md'), 'utf-8');
}

async function appendJson(file: string, entry: object) {
  await fs.mkdir(OUT, { recursive: true });
  const p = path.join(OUT, file);
  let list: object[] = [];
  try {
    list = JSON.parse(await fs.readFile(p, 'utf-8'));
  } catch {
    /* first write */
  }
  list.push(entry);
  await fs.writeFile(p, JSON.stringify(list, null, 2));
}

export interface CallEvent {
  type: 'booked' | 'message' | 'escalated';
  at: string;
  detail: object;
}

export const logCallEvent = (event: Omit<CallEvent, 'at'>) =>
  appendJson('calls.json', { ...event, at: new Date().toISOString() });

// Deterministic mock calendar: three slots per business day for the next
// week, minus anything already booked. Replaced by Cal.com in v2.
const DAILY_SLOTS = ['10:00', '11:30', '14:00'];

async function bookedSlots(): Promise<Set<string>> {
  try {
    const list = JSON.parse(
      await fs.readFile(path.join(OUT, 'appointments.json'), 'utf-8'),
    ) as { slot: string }[];
    return new Set(list.map((a) => a.slot));
  } catch {
    return new Set();
  }
}

export async function availableSlots(): Promise<string[]> {
  const taken = await bookedSlots();
  const slots: string[] = [];
  const day = new Date();
  while (slots.length < 6) {
    day.setDate(day.getDate() + 1);
    const dow = day.getDay();
    if (dow === 0) continue; // closed Sunday
    for (const t of dow === 6 ? ['10:00', '11:30'] : DAILY_SLOTS) {
      const slot = `${day.toISOString().slice(0, 10)} ${t}`;
      if (!taken.has(slot)) slots.push(slot);
      if (slots.length >= 6) break;
    }
  }
  return slots;
}

export async function bookAppointment(entry: {
  slot: string;
  name: string;
  phone: string;
  service: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const open = await availableSlots();
  if (!open.includes(entry.slot)) {
    return { ok: false, reason: 'slot no longer available' };
  }
  await appendJson('appointments.json', { ...entry, bookedAt: new Date().toISOString() });
  await logCallEvent({ type: 'booked', detail: entry });
  return { ok: true };
}
