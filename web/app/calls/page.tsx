// app/calls/page.tsx — the morning report: every overflow/after-hours call
// the agent handled, with outcome and detail. Reads the agent's local
// stores (../data/out); Postgres/CRM replaces them in production.
import Link from 'next/link';
import { promises as fs } from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

interface CallEvent {
  type: 'booked' | 'message' | 'escalated';
  at: string;
  detail: Record<string, string>;
}
interface TranscriptCall {
  startedAt: string;
  items: { role: string; text: string; at: string }[];
}
interface Appointment {
  slot: string;
  name: string;
  phone: string;
  service: string;
  bookedAt: string;
}

async function readJsonObj<T>(file: string): Promise<Record<string, T>> {
  try {
    const p = path.resolve(process.cwd(), '..', 'data', 'out', file);
    return JSON.parse(await fs.readFile(p, 'utf-8'));
  } catch {
    return {};
  }
}

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const p = path.resolve(process.cwd(), '..', 'data', 'out', file);
    return JSON.parse(await fs.readFile(p, 'utf-8'));
  } catch {
    return [];
  }
}

const outcome: Record<CallEvent['type'], { label: string; dot: string }> = {
  booked: { label: 'Booked', dot: 'bg-green-600' },
  message: { label: 'Message', dot: 'bg-neutral-400' },
  escalated: { label: 'Escalated', dot: 'bg-[#c2410c]' },
};

export default async function CallsPage() {
  const events = (await readJson<CallEvent>('calls.json')).sort((a, b) => b.at.localeCompare(a.at));
  const appointments = (await readJson<Appointment>('appointments.json')).sort((a, b) =>
    a.slot.localeCompare(b.slot)
  );
  const transcripts = Object.entries(await readJsonObj<TranscriptCall>('transcripts.json')).sort(
    (a, b) => b[1].startedAt.localeCompare(a[1].startedAt)
  );
  const counts = {
    booked: events.filter((e) => e.type === 'booked').length,
    message: events.filter((e) => e.type === 'message').length,
    escalated: events.filter((e) => e.type === 'escalated').length,
  };

  return (
    <main className="min-h-screen bg-white font-sans text-neutral-900">
      <div className="border-b border-neutral-200">
        <nav className="mx-auto flex h-12 max-w-4xl items-center gap-5 px-4 text-[13px] sm:px-6">
          <span className="font-mono font-semibold tracking-tight">aftercall</span>
          <Link href="/" className="text-neutral-500 hover:text-neutral-900">
            Call demo
          </Link>
          <span className="border-b-2 border-neutral-900 py-3 font-medium">Morning report</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <header className="mb-6">
          <h1 className="text-[20px] font-semibold tracking-[-0.01em]">Morning report</h1>
          <p className="mt-1 text-[13px] text-neutral-500">
            Every call the agent caught while the front desk was busy or closed. Review before
            opening.
          </p>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {(
            [
              ['Calls handled', String(events.length), undefined],
              ['Appointments booked', String(counts.booked), undefined],
              [
                'Escalated to on-call',
                String(counts.escalated),
                counts.escalated > 0 ? 'check these first' : undefined,
              ],
            ] as const
          ).map(([label, value, hint]) => (
            <div key={label} className="rounded-lg border border-neutral-200 p-4">
              <p className="text-[12px] font-medium text-neutral-500">{label}</p>
              <p className="mt-1 font-mono text-[22px] font-medium tracking-tight">{value}</p>
              {hint && <p className="mt-0.5 text-[12px] text-[#c2410c]">{hint}</p>}
            </div>
          ))}
        </div>

        <h2 className="mb-2 text-[13px] font-medium text-neutral-500">Call log</h2>
        <div className="mb-8 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {events.map((e, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <span className="mt-0.5 inline-flex w-24 shrink-0 items-center gap-1.5 text-[12px] font-medium">
                <span className={`h-1.5 w-1.5 rounded-[1px] ${outcome[e.type].dot}`} />
                {outcome[e.type].label}
              </span>
              <div className="min-w-0 flex-1 text-[13px] text-neutral-700">
                {e.type === 'booked' && (
                  <>
                    <span className="font-mono">{e.detail.slot}</span> — {e.detail.name},{' '}
                    {e.detail.service} (<span className="font-mono">{e.detail.phone}</span>)
                  </>
                )}
                {e.type === 'escalated' && (
                  <>
                    {e.detail.reason} → transferred to{' '}
                    <span className="font-mono">{e.detail.transferTo}</span>
                  </>
                )}
                {e.type === 'message' && (
                  <>
                    {e.detail.message} — {e.detail.name} (
                    <span className="font-mono">{e.detail.phone}</span>)
                  </>
                )}
              </div>
              <span className="shrink-0 font-mono text-[11px] text-neutral-400">
                {new Date(e.at).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="p-10 text-center text-[13px] text-neutral-400">
              No calls yet — try the call demo first.
            </p>
          )}
        </div>

        <h2 className="mb-2 text-[13px] font-medium text-neutral-500">Transcripts</h2>
        <div className="mb-8 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {transcripts.map(([room, call]) => (
            <details key={room} className="group">
              <summary className="flex cursor-pointer items-center gap-3 p-4 text-[13px] hover:bg-neutral-50">
                <span className="font-mono text-neutral-900">{room}</span>
                <span className="text-neutral-400">{call.items.length} turns</span>
                <span className="ml-auto font-mono text-[11px] text-neutral-400">
                  {new Date(call.startedAt).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </summary>
              <div className="space-y-2 border-t border-neutral-200 bg-neutral-50/50 p-4">
                {call.items.map((t, i) => (
                  <p key={i} className="text-[13px] leading-relaxed">
                    <span
                      className={`mr-2 font-mono text-[11px] uppercase ${t.role === 'assistant' ? 'text-neutral-400' : 'font-semibold text-neutral-600'}`}
                    >
                      {t.role === 'assistant' ? 'agent' : 'caller'}
                    </span>
                    <span className="text-neutral-800">{t.text}</span>
                  </p>
                ))}
              </div>
            </details>
          ))}
          {transcripts.length === 0 && (
            <p className="p-10 text-center text-[13px] text-neutral-400">
              No transcripts yet — make a call first (the agent must be restarted after this
              update).
            </p>
          )}
        </div>

        <h2 className="mb-2 text-[13px] font-medium text-neutral-500">Upcoming consultations</h2>
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-neutral-200 text-[11px] tracking-wide text-neutral-500 uppercase">
              <tr>
                <th className="px-3 py-2 font-medium">Slot</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Service</th>
                <th className="px-3 py-2 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={i} className="border-b border-neutral-200 last:border-b-0">
                  <td className="px-3 py-2 font-mono">{a.slot}</td>
                  <td className="px-3 py-2">{a.name}</td>
                  <td className="px-3 py-2">{a.service}</td>
                  <td className="px-3 py-2 font-mono">{a.phone}</td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-neutral-400">
                    No consultations booked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
