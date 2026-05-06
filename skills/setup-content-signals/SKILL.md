---
name: setup-content-signals
description: Add Content-Signal directives (search, ai-input, ai-train) to robots.txt for AI agent compliance
---

# Setup Content Signals

Declare how AI systems may use the project's content via `Content-Signal:` directives in `robots.txt`. Usage: `/setup-content-signals` or `/setup-content-signals audit`

## Pre-Work

1. READ @knowledge/25-agent-protocols.md (section 2)
2. READ @knowledge/13-seo-metadata.md (for existing robots/SEO setup)
3. Detect stack: Next.js (`src/app/robots.ts`) or React+Vite (static `public/robots.txt`)

## Steps

### Step 1: Confirm Policy with User

Ask the user about each signal — there is no safe default:

- `search` — allow indexing for search engines? (yes/no)
- `ai-input` — allow real-time AI use (RAG, agents, summarizers)? (yes/no)
- `ai-train` — allow training/fine-tuning of AI models? (yes/no)

Document the decision in the project's README or a `CONTENT-POLICY.md`.

### Step 2: Inspect Existing robots Setup

- Next.js: read `src/app/robots.ts` — likely uses `MetadataRoute.Robots`
- React+Vite: read `public/robots.txt` — plain text

Note: `MetadataRoute.Robots` does not natively support `Content-Signal`. Implementation depends on stack.

### Step 3a: Next.js — Migrate to a Custom route.ts

If `Content-Signal` is required, replace `robots.ts` with a `text/plain` route handler at `src/app/robots.txt/route.ts`:

```ts
export function GET() {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    '',
    'Content-Signal: search=yes, ai-train=yes, ai-input=yes',
    '',
    'Sitemap: https://workspace.hr/sitemap.xml',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

Preserve all existing rules from `robots.ts` (locale-aware disallows, sitemap URL, etc.).

### Step 3b: React+Vite — Edit public/robots.txt

Append the line below all User-agent stanzas:

```
Content-Signal: search=yes, ai-train=yes, ai-input=yes
```

### Step 4: Validate

```bash
# Should include Content-Signal
curl -s http://localhost:3000/robots.txt | grep -i content-signal

# Should not break existing rules
curl -s http://localhost:3000/robots.txt
```

### Step 5: Audit Mode

If invoked as `/setup-content-signals audit`, only:
- Read robots.txt
- Report whether `Content-Signal` is present
- Report parsed values
- Suggest missing signals

Do not modify files in audit mode.

## Rules

- Always set explicit `yes`/`no` — never omit a signal the project has a policy for
- Preserve existing User-agent rules and Sitemap directives
- Place `Content-Signal:` once at top level, not under each User-agent stanza (unless policy differs by agent)
- Reflect the chosen policy in project documentation
