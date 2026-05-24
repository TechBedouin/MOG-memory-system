# MOG vs the market (2026)

Honest comparison for positioning—not marketing fluff.

---

## vs Vector memory (Mem0, Zep, LangMem)

| | MOG | Vector memory |
|--|-----|-----------------|
| Storage | Markdown in git | Embeddings + DB |
| Retrieval | Pointer TL;DR → optional read | Similarity search |
| Debug | `git diff` | Hard |
| Privacy | Local, no vendor | Often cloud |
| Best for | Structured projects, coding agents | Chatbots, open-domain recall |
| Weak for | "Remember everything I ever said" | Exact file paths, blockers, git-friendly state |

**MOG is not a replacement for RAG on large corpora.** It is a replacement for **unstructured "memory APIs" on structured work**.

---

## vs AGENTS.md / CLAUDE.md / Cursor rules

| | MOG | Single AGENTS.md |
|--|-----|------------------|
| Structure | Multi-file graph | One file |
| Hot/cold split | `active_state` vs `soul` vs entities | Usually monolithic |
| Scaling | Add nodes without bloating boot | File grows forever |
| Graph edges | Specified (underused) | Rare |
| Discipline | Mandated updates | Hope |

**Reality:** Most teams already use "markdown memory." MOG's delta is **explicit layers + pointer cache + graph syntax**—not magic.

---

## vs Obsidian / Notion knowledge bases

| | MOG | Obsidian |
|--|-----|----------|
| Author | AI agent (compiler) | Human |
| Links | `[path]` + TL;DR | `[[wikilink]]` |
| Purpose | Session continuity | Human thinking |
| Validation | Needs `mog lint` | Optional plugins |

Obsidian optimizes **human sense-making**. MOG optimizes **agent boot cost**.

---

## vs MemGPT / Letta (hierarchical memory)

Letta uses tiers (core / archival / recall) with tool-managed paging.

MOG maps loosely:

| Letta | MOG |
|-------|-----|
| Core memory | `soul.md` |
| Recall | `active_state.md` pointers |
| Archival | Entity files |

**Difference:** Letta is runtime-managed; MOG is **file-managed** and git-native. Letta needs their server/runtime; MOG needs only an editor hook.

---

## vs "just summarize the chat"

| | MOG | End-of-chat summary |
|--|-----|----------------------|
| Structure | Relational | Prose blob |
| Partial updates | Edit one client node | Rewrite whole summary |
| Conflicts | Per-entity files | One file drifts |
| Team use | Mergeable in git | Merge hell |

---

## Positioning sentence (use on GitHub)

> **MOG treats agent memory like a database you can commit—not a conversation you can search.**

---

## What would make MOG *actually* uncrowded

Nobody popular is shipping all of:

1. Vectorless relational graph  
2. Mandatory TL;DR pointer cache (L2)  
3. Deterministic compile/lint tooling  
4. Git-diffable session continuity demos  

Pick **3 of 4** for v0.1; add compile in v0.2. That's a real open-source niche.
