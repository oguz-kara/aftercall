Demo project built to show what I can build. Not a client project.

# AfterCall

**Overflow & after-hours AI receptionist for aesthetic clinics.** When the
front desk doesn't pick up within four rings — or after closing — AfterCall
answers: real questions from the clinic's own knowledge (services, prices,
hours), real appointment slots via the calendar tool, emergency keywords
warm-transferred to the on-call phone, and every call logged with a full
transcript for the morning review. It never replaces the front desk; it
catches what the front desk misses.

> Personal build. Built on LiveKit's MIT starters
> [agent-starter-node](https://github.com/livekit-examples/agent-starter-node) (`2045cc4`)
> and [agent-starter-react](https://github.com/livekit-examples/agent-starter-react) (`46f51a6`)
> — I added the clinic knowledge config, booking + emergency tools, Claude
> integration, call persistence and the call-review dashboard. Demo clinic
> and data are fictional.

## Layout

```
agent/   LiveKit voice agent (Node) — STT → LLM (Claude) → TTS, tools
web/     Next.js voice UI (LiveKit React) + /calls review pages
data/    fictional clinic config (services, hours, FAQ, emergency rules)
docs/    spec + measurement protocol
```

## License

Both subprojects MIT (LICENSE files preserved). Modifications (c) Oguz Kara.
