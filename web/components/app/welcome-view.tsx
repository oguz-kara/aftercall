'use client';

import { useEffect, useState } from 'react';

// AfterCall welcome — "the closed reception's card": the night-time notice a
// caller would meet, with one action. Palette + type: see styles/globals.css
// (porcelain / ink / eucalyptus; Fraunces reserved for the clinic's voice).

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

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
    <div ref={ref} className="bg-[#F6F3EF]">
      <section className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
        {/* clinic voice */}
        <p className="font-mono text-[11px] tracking-[0.22em] text-[#8B857C] uppercase">
          Velora Aesthetics · after hours
        </p>

        <h1
          className="mt-4 max-w-xl text-[34px] leading-[1.15] font-normal text-[#211E1A] sm:text-[40px]"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
        >
          Reception is closed.
          <br />
          Our assistant is answering.
        </h1>

        <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[#8B857C]">
          Ask about treatments and prices, book a free consultation, or reach the on-call
          practitioner in an emergency.
        </p>

        {/* signature: the breathing call button */}
        <button
          onClick={onStartCall}
          aria-label={startButtonText}
          className="group relative mt-12 flex size-28 items-center justify-center rounded-full bg-[#5F7A6A] text-[#F6F3EF] shadow-[0_10px_30px_rgba(95,122,106,0.35)] transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#5F7A6A]/30"
        >
          <span className="ac-pulse absolute inset-0 rounded-full border border-[#5F7A6A]/50" />
          <span className="ac-pulse ac-pulse-late absolute inset-0 rounded-full border border-[#5F7A6A]/35" />
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6.6 3h2.3c.5 0 .9.3 1 .8l.7 3a1 1 0 0 1-.3 1L8.8 9.2a13.4 13.4 0 0 0 6 6l1.4-1.5a1 1 0 0 1 1-.3l3 .7c.5.1.8.5.8 1v2.3c0 .6-.5 1.1-1.1 1.1C11.6 18.9 5.1 12.4 4.5 4.1 4.5 3.5 5 3 5.6 3h1Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <p className="mt-5 font-mono text-[12px] text-[#8B857C]">
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#5F7A6A] align-middle" />
          assistant on duty
          {now && (
            <>
              {' '}
              · {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </>
          )}
        </p>

        {/* quiet service line */}
        <p className="mt-14 text-[12px] tracking-wide text-[#B4AEA3]">
          Botox · Dermal fillers · Laser resurfacing · Chemical peels — consultations are free
        </p>
      </section>

      <div className="fixed bottom-4 left-0 flex w-full items-center justify-center">
        <p className="text-[11px] text-[#B4AEA3]">
          Demo — Velora Aesthetics is a fictional clinic. Calls are answered by an AI assistant and
          logged for the morning report.
        </p>
      </div>
    </div>
  );
};
