'use client';

import { useEffect, useState } from 'react';

// AfterCall welcome — Hume-style "scientific pastel instrument panel"
// (design-system/design.md): paper canvas, ink type at tight tracking,
// mono lab-labels, pastel category chips, and the iris-gradient orb as
// the single vivid moment. Fellix substituted with the app sans at 500.

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const services = [
  { label: 'Botox', wash: '#fce0ee' },
  { label: 'Dermal fillers', wash: '#fdebf7' },
  { label: 'Laser resurfacing', wash: '#ffe9cf' },
  { label: 'Chemical peels', wash: '#daf7ee' },
  { label: 'Free consultation', wash: '#cef1e1' },
];

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  const now = useClock();

  return (
    <div ref={ref} className="bg-white">
      <section className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
        {/* lab label */}
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#7a7876] uppercase">
          Velora Aesthetics · After-hours line
        </p>

        <h1 className="mt-5 max-w-2xl text-[36px] leading-[1.11] font-medium tracking-[-0.025em] text-[#222222] sm:text-[44px]">
          Reception is closed.
          <br />
          The assistant is listening.
        </h1>

        <p className="mt-4 max-w-md text-[16px] leading-[1.5] tracking-[-0.4px] text-[#7a7876]">
          Ask about treatments and prices, book a free consultation, or reach the on-call
          practitioner in an emergency.
        </p>

        {/* signature: the iris orb */}
        <button
          onClick={onStartCall}
          aria-label={startButtonText}
          className="group relative mt-14 flex size-28 items-center justify-center rounded-full text-white transition-transform hover:scale-[1.04] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#c094e4]/40"
          style={{ background: 'linear-gradient(135deg, #c094e4 0%, #f7bbe6 55%, #ffb760 100%)' }}
        >
          <span className="ac-pulse absolute inset-0 rounded-full border" />
          <span className="ac-pulse ac-pulse-late absolute inset-0 rounded-full border" />
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.6 3h2.3c.5 0 .9.3 1 .8l.7 3a1 1 0 0 1-.3 1L8.8 9.2a13.4 13.4 0 0 0 6 6l1.4-1.5a1 1 0 0 1 1-.3l3 .7c.5.1.8.5.8 1v2.3c0 .6-.5 1.1-1.1 1.1C11.6 18.9 5.1 12.4 4.5 4.1 4.5 3.5 5 3 5.6 3h1Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <p className="mt-6 font-mono text-[10px] tracking-[0.25em] text-[#7a7876] uppercase">
          <span
            className="mr-2 inline-block size-1.5 rounded-full align-middle"
            style={{ background: '#c094e4' }}
          />
          Assistant on duty
          {now && (
            <> · {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</>
          )}
        </p>

        {/* pastel category chips */}
        <div className="mt-14 flex max-w-lg flex-wrap items-center justify-center gap-2">
          {services.map((s) => (
            <span
              key={s.label}
              className="rounded-full px-3.5 py-1.5 text-[12px] tracking-[-0.2px] text-[#574853]"
              style={{ background: s.wash }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </section>

      <div className="fixed bottom-4 left-0 flex w-full items-center justify-center">
        <p className="font-mono text-[10px] tracking-[0.1em] text-[#b3b1af] uppercase">
          Demo — Velora Aesthetics is a fictional clinic · calls are logged for the morning report
        </p>
      </div>
    </div>
  );
};
