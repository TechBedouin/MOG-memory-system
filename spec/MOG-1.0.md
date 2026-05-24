# MOG Specification v1.0

**Markdown Object Graph** — normative syntax for vectorless agent memory.

## 1. Scope

MOG defines how coding agents store durable state in a git repository using markdown files and explicit graph edges. Implementations SHOULD provide lint tooling (reference: `mog-memory` CLI).

## 2. Layers

| Layer | File | Mutability | Loaded |
|-------|------|------------|--------|
| L0 Identity | `soul.md` | Rare | Every session |
| L2 RAM | `active_state.md` | Every task | Every session |
| L3+ Entities | `knowledge/**/*.md` etc. | On demand | Pointer-driven |

## 3. Entity nodes

- One file = one entity
- MUST have an H1 title
- MAY declare graph edges immediately below H1

## 4. RAM pointers

Format (normative):

```markdown
- **[relative/path.md]** : TL;DR -> Single sentence semantic summary.
```

Rules:
- Path MUST be relative to repository root
- TL;DR MUST be ≥ 8 characters
- TL;DR MUST remain accurate when entity changes

## 5. RAM required fields

```markdown
- **Active Thread:** <current focus>
- **Immediate Next Step:** <next action>
```

Optional:

```markdown
- **[Blocked_By]:** <blocker description or path>
```

## 6. Graph edges

Declared as markdown headers (case-sensitive):

```markdown
[Relates_To]: path/to/file.md
[Blocked_By]: path/to/issue.md
[Resolves]: path/to/project.md
[Prerequisite_For]: path/to/file.md
```

- Target MUST resolve to an existing `.md` file
- Multiple edges of the same type are allowed (repeat header lines)

## 7. Agent obligations

1. Boot: read L0 + L2 before acting
2. Compile: update L2 after every milestone
3. No journals: do not append chat transcripts to memory files
4. Minimize tokens: prefer TL;DR over full file reads

## 8. Tooling (non-normative)

Reference CLI commands:
- `mog init` — scaffold
- `mog lint` — validate
- `mog graph` — Mermaid export
- `mog weave` — backlink index
- `mog query "relates_to:*"` — edge search

## 9. Versioning

This document is MOG-1.0. Breaking changes increment major version.
