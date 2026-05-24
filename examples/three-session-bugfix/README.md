# Three-session bugfix demo

Shows how MOG carries context across agent sessions **without** vector DB or chat export.

## Session 1 — Discover

`active_state.md` diff:

```diff
- **Active Thread:** Routine API maintenance
+ **Active Thread:** Investigate OAuth 401 spikes in production
+ **Immediate Next Step:** Document root cause in knowledge/bugs/
+
+- **[knowledge/bugs/oauth-401.md]** : TL;DR -> Intermittent 401 after 60min; suspect expired token without refresh.
```

Agent creates `knowledge/bugs/oauth-401.md` with `[Relates_To]: auth-service`.

## Session 2 — Fix

New agent reads RAM → loads only the TL;DR → opens bug file → edits `src/auth.js`.

RAM update:

```diff
- **Immediate Next Step:** Document root cause
+ **Immediate Next Step:** Deploy fix and verify 401 rate drops
```

## Session 3 — Close

Agent adds `[Resolves]` edge, updates TL;DR, clears blocker.

## Try it

```bash
cd examples/three-session-bugfix
mog lint
mog graph
mog query "relates_to:*"
```

**Token math:** Session 2 boot ≈ `soul.md` + `active_state.md` (~400 tokens), not full chat history.
