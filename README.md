Demo project built to show what I can build. Not a client project.

# AfterCall

**Overflow & after-hours AI receptionist for aesthetic clinics.** When the
front desk doesn't pick up within four rings — or after closing — AfterCall
answers: real questions from the clinic's own knowledge (services, prices,
hours), open slots and bookings through the calendar tool, an immediate
hand-off to the on-call practitioner on emergency keywords, and every call
logged with a full transcript for the morning review. It never replaces the
front desk; it catches what the front desk misses.

In v1 the calendar is a JSON file and the emergency hand-off is logged and
announced to the caller. Cal.com booking and a real SIP warm transfer are the
next steps (see `docs/spec.md`).

> Personal build. Built on LiveKit's MIT starters
> [agent-starter-node](https://github.com/livekit-examples/agent-starter-node) (`2045cc4`)
> and [agent-starter-react](https://github.com/livekit-examples/agent-starter-react) (`46f51a6`)
> — I added the clinic knowledge config, booking + emergency tools, call
> persistence and the call-review dashboard. Demo clinic and data are fictional.

The language model runs through LiveKit Inference: `google/gemma-4-31b-it` by
default, configurable with `AFTERCALL_LLM`. A swap to Claude is prepared in
`agent/src/agent.ts` but not enabled.

## Layout

```
agent/   LiveKit voice agent (Node) — STT → LLM (LiveKit Inference) → TTS, tools
web/     Next.js voice UI (LiveKit React) + /calls review pages
data/    fictional clinic config (services, hours, FAQ, emergency rules)
docs/    spec + measurement protocol
```

## License

Both subprojects MIT (LICENSE files preserved). Modifications (c) Oguz Kara.
