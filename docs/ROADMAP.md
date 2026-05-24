# MOG — 30-Day Ship Plan (GitHub v0.1)

Goal: Public repo that proves **vectorless agent memory** works, without exposing private `ME_AGENT` data.

---

## Phase 0 — Extract (Days 1–2)

- [ ] Copy `knowledge/MOG_RULES.md` → `spec/MOG-1.0.md` (scrub personal examples)
- [ ] Create generic `templates/soul.md` and `templates/active_state.md`
- [ ] Remove all client names, DZD prices, phone numbers from public templates
- [ ] Pick license: **MIT** (max adoption) or **Apache-2.0** (patent clarity)

---

## Phase 1 — Minimum CLI (Days 3–10)

Language: **TypeScript** (npm `npx mog`) or **Python** (`pip install mog-memory`) — match TechBedouin stack preference.

### `mog init`

Creates in target directory:

```
.soul.md              → soul.md
active_state.md
knowledge/MOG_RULES.md
.cursor/rules/mog.mdc   # boot + update mandate
```

### `mog lint`

| Check | Severity |
|-------|----------|
| `active_state.md` exists | error |
| Every `[path]` pointer has `: TL;DR ->` | error |
| Path resolves to real file | error |
| `Active Thread` / `Immediate Next Step` present | warn |
| Files with `[Relates_To]` target exists | error |
| Orphan `.md` in `knowledge/` (no inbound link) | info |

### `mog graph`

- Parse all `*.md` for edge headers  
- Output `GRAPH.mmd` (Mermaid) or `graph.json`  
- **This alone is demo fuel for YouTube**

---

## Phase 2 — Example repo (Days 11–15)

`examples/three-session-bugfix/`:

- Session 1: Agent discovers bug, writes `knowledge/bugs/oauth-401.md`, updates RAM  
- Session 2: Agent follows pointer, implements fix in fake `src/`  
- Session 3: Agent marks resolved, updates `[Resolves]` edge  

Commit history tells the story. README shows only diffs to `active_state.md` + one entity file.

---

## Phase 3 — Positioning (Days 16–20)

### README headline options

1. **"Git for agent memory — no vectors, no API keys"**  
2. **"MOG: compile your agent's brain into markdown"**  
3. **"Stop RAG-ing your codebase. Graph it."**

### Tags

`ai-agents`, `cursor`, `claude`, `memory`, `markdown`, `knowledge-graph`, `no-vector-db`

### What NOT to claim

- "Better than Mem0 at everything"  
- "Replaces fine-tuning"  
- "Works with zero agent discipline" (until `mog compile` exists)

---

## Phase 4 — TechBedouin launch (Days 21–30)

**Video angle (8 min, Fireship pace):**

1. Problem: agents forget between sessions (30 sec)  
2. Show chat-only failure vs MOG boot (2 min)  
3. Live `mog lint` + `mog graph` (2 min)  
4. Three-session demo via git log (2 min)  
5. CTA: star repo, `npx mog init` (30 sec)  

**Thumbnail:** Bedouin + terminal + graph nodes, text: **"NO VECTOR DB"**

---

## Success metrics (v0.1)

| Metric | Target |
|--------|--------|
| GitHub stars (30 days) | 100+ (realistic with video) |
| `npx mog init` runs | track via npm downloads |
| External PRs | 1 contributor fixing lint rules |
| Your own MOG adoption | graph edges on ≥50% of entity files |

---

## Deferred (v0.2+)

- `mog compile` — structured session handoff  
- `mog query` — MOG-QL  
- Confidence / `last_verified` on pointers  
- VS Code / Cursor extension panel showing graph  
- Multi-namespace RAM for team agents  

---

## Private vs public boundary

| Keep in `ME_AGENT` (private) | Publish in `mog-memory` (public) |
|------------------------------|----------------------------------|
| `soul.md` (your identity) | `templates/soul.md` (generic) |
| `business/clients/*` | `examples/*` (fictional) |
| `SALES_TACTICS_TechBedouin.md` | Spec only; no sales playbook |
| Real pipeline state | Demo `active_state.md` snapshots |
