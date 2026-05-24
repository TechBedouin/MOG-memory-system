# mog-memory

### Git for agent memory. No vectors. No API keys. No amnesia.

<p align="center">
  <strong>Compile your coding agent's brain into markdown — then diff it like code.</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></a>
  <a href="https://www.npmjs.com/package/mog-memory"><img src="https://img.shields.io/npm/v/mog-memory.svg" alt="npm"></a>
  <img src="https://img.shields.io/badge/vector%20DB-none-red" alt="no vector db">
  <img src="https://img.shields.io/badge/Cursor-ready-000000" alt="cursor">
</p>

---

Your agent forgets everything when the chat ends. You paste context. You pay for tokens. You still get wrong answers.

**MOG (Markdown Object Graph)** fixes that by making memory a **relational graph of markdown files** in your repo — with a hot RAM layer, semantic pointers, and a CLI that lints what your agent wrote.

```bash
npx mog init .
mog lint
mog graph
```

**~400 tokens to boot the next session** instead of re-uploading your entire life story.

---

## Why stars flock here (and not to another Mem0 wrapper)

| Everyone else | MOG |
|---------------|-----|
| Embeddings + hosted DB | Files in **your** git repo |
| "Remember what I said" | **Compile what is true now** |
| Opaque memory API | `git diff` on `active_state.md` |
| Hope the agent updates memory | `mog lint` in CI |
| Similarity search | **Graph edges** + TL;DR pointers |

> Memory is **compiled state**, not **recalled conversation**.

---

## 60-second start

```bash
# 1. Scaffold memory in any repo
npx mog init .

# 2. Agent reads soul.md + active_state.md every session (Cursor rule included)

# 3. After each task, agent updates active_state.md:
#    - **Active Thread:**
#    - **Immediate Next Step:**
#    - **[path.md]** : TL;DR -> one sentence

# 4. Validate
mog lint
mog graph --out docs/memory-graph.mmd
mog weave          # backlink index → memory/GRAPH_INDEX.md
mog query "relates_to:*"
```

---

## Architecture

```
soul.md              ← L0 identity (cold, small)
active_state.md      ← L2 RAM (hot — current thread + pointers)
knowledge/*.md       ← entity nodes (bugs, ADRs, features)
     ↑
     └── [Relates_To] / [Blocked_By] graph edges
```

**Boot:** soul → RAM → follow pointers only if TL;DR isn't enough.

**Write:** agent edits entity files + RAM after every milestone.

Full spec: [spec/MOG-1.0.md](./spec/MOG-1.0.md) · Deep dive: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## CLI reference

| Command | What it does |
|---------|----------------|
| `mog init [dir]` | Scaffold soul, RAM, Cursor rule, CI workflow |
| `mog lint [dir]` | Broken pointers, missing TL;DR, bad edges |
| `mog graph [dir]` | Export `GRAPH.mmd` (Mermaid) |
| `mog weave [dir]` | Generate `memory/GRAPH_INDEX.md` backlinks |
| `mog query "relates_to:*"` | Search graph edges without vectors |

Exit code `1` on lint errors — wire it into CI.

---

## Live demo: 3 sessions, 1 bug

See [examples/three-session-bugfix](./examples/three-session-bugfix/README.md) — an agent discovers OAuth 401s, fixes `auth.js`, and closes the loop. Only markdown diffs prove continuity.

```bash
cd examples/three-session-bugfix && mog lint && mog graph
```

---

## Cursor / Claude / Cline

`mog init` drops `.cursor/rules/mog.mdc` with boot + RAM mandate.

Works the same with `CLAUDE.md`, `AGENTS.md`, or `.clinerules` — point them at `soul.md` + `active_state.md`.

---

## Comparison

| | MOG | Mem0 / Zep | Single AGENTS.md |
|--|-----|------------|------------------|
| Storage | Git markdown | Cloud vectors | One growing file |
| Audit | `git diff` | Opaque | Merge pain |
| Boot cost | ~400–1.5k tokens | API + retrieval | Bloats forever |
| Best for | Coding agents, solo/team repos | Chatbots | Tiny projects |

[Full comparison →](./docs/COMPARISON.md)

---

## Publish checklist

```bash
git init
git add .
git commit -m "feat: MOG v1.0 — vectorless agent memory"
gh repo create TechBedouin/mog-memory --public --source=. --push
npm publish --access public
```

---

## Contributing

PRs welcome. Run `npm test` before submitting.

---

## License

MIT © [Abderrahmane Khoudja](https://github.com/TechBedouin)

---

<p align="center">
  <sub>Built for agents that ship code, not chat logs.</sub><br>
  <sub>If MOG saved your context window, ⭐ star the repo.</sub>
</p>
