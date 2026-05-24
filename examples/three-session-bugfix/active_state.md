# Active State (RAM)

## Current execution context
- **Active Thread:** OAuth 401 bug — verified fixed in production
- **Immediate Next Step:** Monitor token refresh metrics for 24h
- **[Blocked_By]:** None

## Semantic pointers

- **[knowledge/bugs/oauth-401.md]** : TL;DR -> Root cause was missing token refresh on 401; fixed in auth.js with retry wrapper.
- **[knowledge/projects/auth-service.md]** : TL;DR -> Payments API auth module; owns OAuth client and refresh logic.
