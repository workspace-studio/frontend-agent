---
paths:
  - "app/api/**"
  - "src/app/api/**"
---

# API Route Rules

## Input Validation
- Validate ALL inputs with Zod schemas
- Parse request body: `schema.safeParse(await req.json())`
- Validate URL params: `z.string().uuid()`
- Return 400 with `{ error: "..." }` on validation failure

## Authentication
- All protected routes: `const user = await requireAuth()`
- `requireAuth()` throws 401 if no session
- NEVER trust client-sent user IDs — use `auth.uid()`

## Error Handling
- Consistent format: `{ error: string, code?: string }`
- NEVER expose stack traces or internal errors
- Log errors with context (route, user_id, input)
- Return appropriate HTTP codes:
  - 400 = bad input, 401 = no auth, 403 = forbidden
  - 404 = not found, 429 = rate limited, 500 = server error

## Rate Limiting
- All public endpoints: rate limit by IP
- Contact forms: 5 req / 60s
- Auth endpoints: 10 req / 60s
- Use Upstash Redis: `@upstash/ratelimit`

## Email Services
- API keys MUST be in `.env` (never hardcoded)
- Sanitize user input before including in email body
- Use template functions for HTML emails (never concatenate)
- Return 200 quickly, process heavy logic async

## Response
- Always return `NextResponse.json()`
- Set Cache-Control headers where appropriate
