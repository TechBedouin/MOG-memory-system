# MOG Rules (project copy)

See the normative spec: [spec/MOG-1.0.md](../spec/MOG-1.0.md) in the mog-memory package, or https://github.com/TechBedouin/mog-memory/blob/main/spec/MOG-1.0.md

## Quick reference

1. **Entity node** — one markdown file = one object (bug, feature, ADR).
2. **RAM pointer** — `**[path/file.md]** : TL;DR -> one sentence summary`
3. **Graph edge** — header under H1: `[Relates_To]: other/file.md`
4. **End of task** — update `active_state.md` before ending your turn

Valid edges: `Relates_To`, `Blocked_By`, `Resolves`, `Prerequisite_For`
