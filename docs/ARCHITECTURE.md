# MOG Architecture

## Mental model

```
                    ┌─────────────────┐
                    │    soul.md      │  L0 Identity (cold, rarely changes)
                    │  boot + rules   │
                    └────────┬────────┘
                             │ always loaded
                             ▼
                    ┌─────────────────┐
                    │ active_state.md │  L2 RAM (hot, every session)
                    │ pointers + TL;DR│
                    └────────┬────────┘
                             │ load on demand
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ knowledge│  │ business │  │ projects │
        │  nodes   │  │  nodes   │  │  nodes   │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │    [Relates_To] edges (sparse today)
             └────────────┴──────────────┘
```

MOG is **not** a retrieval system. It is a **write-optimized state machine** disguised as files.

---

## Read path (session start)

1. Agent loads `soul.md` (~500–800 tokens) — identity + mandates  
2. Agent loads `active_state.md` (~400–1200 tokens) — execution context  
3. For current task, agent scans pointer TL;DRs  
4. **Only if** TL;DR is insufficient → `Read` the target file  
5. Deep files may declare `[Relates_To]` → optional further hops  

**Design goal:** 90% of sessions never leave RAM + soul.

---

## Write path (task end — the critical path)

Intended flow:

1. Agent completes work (code, sales script, client update)  
2. Agent edits entity node(s) if needed (`overview.md`, project doc, etc.)  
3. Agent edits `active_state.md`:
   - `Active Thread`
   - `Immediate Next Step`
   - `[Blocked_By]` if any
   - New/updated pointer with **1-sentence TL;DR**

Enforced by:

- `soul.md` § Self-Healing MOG Updates  
- `.clinerules` § Self-Healing Memory Mandate  

**Failure mode:** Agent ends turn without editing RAM → next session amnesia. No tooling catches this today.

---

## Entity node conventions

### Good entity (client example)

```markdown
# Client: Er-Rifaq

## Business Info
...

## Project Status
...
```

### Good pointer (in RAM)

```markdown
- **[business/clients/Er_Rifaq/overview.md]** : TL;DR -> Car rental MVP shipped; callback Monday.
```

### Good graph header (deep file)

```markdown
# TechBedouin Sales Pipeline
[Relates_To]: projects/vertex-proxy.md
[Relates_To]: soul.md
```

### Anti-patterns observed in production

| Anti-pattern | Why it hurts |
|--------------|--------------|
| Chronological journal in `active_state.md` | Bloats RAM; violates "relational not temporal" |
| Pointer without TL;DR | Forces full file read; defeats L2 cache |
| Entity file with no edges when related work exists | Graph stays a star; no traversal |
| Stale `Active Thread` after pivot | Wrong context for entire session |
| Duplicate facts in soul + entity + RAM | Token waste + contradiction risk |

---

## Layer comparison (MOG vs classical memory)

| | MOG layer | Analog |
|--|-----------|--------|
| L0 | `soul.md` | System prompt / persona |
| L2 | `active_state.md` | Working memory / scratchpad |
| L3+ | Entity `.md` files | Long-term store |
| — | `[Relates_To]` edges | Foreign keys |
| — | TL;DR on pointers | Materialized view / index |

There is **no L1** in the spec today. A future `session_scratch.md` (ephemeral, gitignored) could hold turn-level noise without polluting RAM.

---

## What is NOT part of MOG (in this workspace)

| System | Location | Difference |
|--------|----------|------------|
| Mark-XXX JSON memory | `projects/Abderrahmane AI/Mark-XXX/memory/` | Key-value `long_term.json`, voice assistant, not graph |
| Vector RAG | Not used in MOG | MOG explicitly avoids embeddings |
| Cursor chat history | IDE-native | Ephemeral; not compiled into graph |

Do not conflate these when publishing MOG publicly.

---

## Failure modes & mitigations

| Failure | Symptom | Mitigation (roadmap) |
|---------|---------|----------------------|
| RAM not updated | Next agent wrong thread | `mog compile` hook, CI on `active_state.md` |
| Broken path in pointer | Read fails | `mog lint` |
| TL;DR drift | Summary lies vs file | `mog lint --verify-tldr` (LLM or heuristic) |
| Graph orphan | File never linked | `mog graph --orphans` |
| Token explosion | Too many pointers in RAM | Max pointer count + confidence eviction |
| Multi-agent clash | Two agents overwrite RAM | Namespaced `active_state` per role |

---

## Token budget (rule of thumb)

| Component | Target |
|-----------|--------|
| `soul.md` | &lt; 1,000 tokens |
| `active_state.md` | &lt; 1,500 tokens |
| Pointers in RAM | ≤ 15 active |
| Deep file load | Pay-as-you-go |

MOG wins when **compilation discipline** beats **retrieval brute force**.
