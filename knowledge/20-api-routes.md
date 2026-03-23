# API Routes

Rules for Next.js API routes (`app/api/`) and server-side API handlers.

## Input Validation

Always validate request bodies with Zod before processing:

```typescript
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = ContactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    );
  }

  // Use result.data — typed and validated
}
```

Validate URL params too:

```typescript
const ParamsSchema = z.object({
  id: z.string().uuid(),
});
```

## Authentication

```typescript
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Use user.id from session — NEVER trust client-sent user IDs
}
```

- All protected routes: `const user = await requireAuth()`
- `requireAuth()` throws 401 if no session
- NEVER trust client-sent user IDs, emails, or roles — derive from session/token
- Return 401 for unauthenticated, 403 for unauthorized

## Error Handling

Consistent error response format:

```typescript
type ApiError = {
  error: string;
  code?: string;
};

try {
  // ... route logic
} catch (error) {
  console.error('[API] POST /api/contact:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

- NEVER expose stack traces, internal error messages, or DB details to the client
- Always log the full error server-side with route context
- Return appropriate HTTP codes:
  - 400 = bad input, 401 = no auth, 403 = forbidden
  - 404 = not found, 429 = rate limited, 500 = server error

## Rate Limiting

For public endpoints (contact forms, auth), apply rate limiting:

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '60 s'),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // ... handle request
}
```

Suggested limits:
- Contact forms: 5 requests / 60s
- Auth endpoints: 10 requests / 60s
- Public API: 30 requests / 60s

## Email Services

When sending emails (contact forms, notifications):

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // ... validate input first

  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: process.env.CONTACT_EMAIL!,
    subject: `Contact: ${result.data.name}`,
    html: renderEmailTemplate(result.data),
  });

  return NextResponse.json({ success: true });
}
```

- Email API keys MUST be in `.env` (never hardcoded)
- Validate and sanitize all user input before including in email body
- Use a template function for HTML emails — never concatenate user input into HTML
- Always return 200 quickly, process heavy email logic async if needed

## Response Format

All API routes return consistent JSON:

```typescript
// Success
NextResponse.json({ data: result }, { status: 200 });
NextResponse.json({ success: true }, { status: 201 });

// Error
NextResponse.json({ error: 'Description' }, { status: 4xx });
NextResponse.json({ error: 'Internal server error' }, { status: 500 });
```

Set Cache-Control headers where appropriate:

```typescript
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
});
```

## Forbidden Patterns

- NEVER use `any` for request/response types — always define Zod schemas or interfaces
- NEVER trust client input without validation
- NEVER expose environment variables or internal paths in responses
- NEVER use string concatenation for SQL — use parameterized queries or ORM
- NEVER send raw error objects to the client
- NEVER hardcode API keys or secrets in source code
