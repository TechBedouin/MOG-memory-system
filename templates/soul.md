# Soul — Core Identity

Immutable context for your coding agent. Keep under ~800 tokens.

## Project
- **Name:** Your Project
- **Stack:** e.g. TypeScript, Next.js, PostgreSQL
- **Repo purpose:** One sentence — what this codebase does

## Agent directives
1. **Boot:** Read `soul.md` then `active_state.md` before any work.
2. **Memory:** You compile state into markdown — never write chat journals.
3. **RAM update:** After every milestone, edit `active_state.md` (Active Thread, Next Step, pointers).

## Communication
- Be direct. No fluff. Match the team's competence level.

## MOG rules (summary)
- One `.md` file = one entity node
- RAM pointers MUST include `: TL;DR ->`
- Deep files use graph headers: `[Relates_To]: path/to/file.md`
- Run `mog lint` before opening a PR
