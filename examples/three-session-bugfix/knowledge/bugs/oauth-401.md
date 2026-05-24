# OAuth 401 Unauthorized Bug
[Relates_To]: knowledge/projects/auth-service.md
[Resolves]: knowledge/projects/auth-service.md

## Root cause
Google OAuth access tokens expire after ~60 minutes. `auth.js` retried the request without refreshing.

## Fix
Added `refreshTokenOn401()` before retry in `src/auth.js`.

## Status
Resolved — deployed session 3.
