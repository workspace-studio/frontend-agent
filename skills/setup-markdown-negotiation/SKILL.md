---
name: setup-markdown-negotiation
description: Serve markdown versions of pages via Accept text/markdown for token-efficient AI consumption
---

# Setup Markdown Negotiation

Add support for `Accept: text/markdown` so AI agents receive a clean markdown version of pages with YAML frontmatter. Usage: `/setup-markdown-negotiation` or `/setup-markdown-negotiation /about`

## Pre-Work

1. READ @knowledge/25-agent-protocols.md (section 3)
2. READ @knowledge/13-seo-metadata.md (frontmatter source = existing metadata)
3. READ @knowledge/10-nextjs-app-router.md (for middleware patterns)
4. Detect stack: this skill is **Next.js only**. For SPAs, document the host-level requirement and stop.

## Steps

### Step 1: Choose Coverage

Ask the user:
- All public pages, or specific routes?
- Per-locale variants? (every `[locale]/...` URL)
- Should JSON-LD be included in the markdown body?

### Step 2: Add Middleware Detection

Edit `src/middleware.ts` (or `src/proxy.ts` for Next.js 16) to detect markdown requests:

```ts
const accept = request.headers.get('accept') || '';
const wantsMarkdown = accept.includes('text/markdown');
```

If `wantsMarkdown` and the path matches an enabled route, rewrite to a markdown handler (e.g., `/__md{pathname}`).

### Step 3: Implement the Markdown Handler

Create a route group `src/app/__md/[...path]/route.ts` that:

1. Resolves the source page's metadata (reuse `generateMetadata` if exported)
2. Renders the page server-side OR reads pre-built MDX/markdown source
3. Strips `<script>`, `<style>`, `<nav>`, `<footer>`
4. Builds a markdown body with YAML frontmatter

```ts
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const { title, description, image } = await getMetadataFor(params.path);
  const body = await getMarkdownBodyFor(params.path);

  const frontmatter = ['---', `title: ${title}`, `description: ${description}`, image && `image: ${image}`, '---', '']
    .filter(Boolean)
    .join('\n');

  const response = `${frontmatter}\n${body}\n`;
  const tokens = Math.ceil(response.length / 4); // rough estimate

  return new NextResponse(response, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokens),
      'Content-Signal': 'search=yes, ai-train=yes, ai-input=yes',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

### Step 4: Pick a Source Strategy

Choose ONE of:

- **MDX/markdown source**: pages already authored as `.mdx` — easiest. Read source, render frontmatter, return body.
- **HTML→Markdown conversion**: render the page server-side, convert with `turndown` (`yarn add turndown`).
- **Hand-written markdown twins**: maintain `page.md` next to `page.tsx`. Most controlled, most maintenance.

Recommend MDX or twin files for stable marketing pages; HTML conversion for dynamic content.

### Step 5: Validate

```bash
# HTML still served by default
curl -i http://localhost:3000/about | head -5

# Markdown when requested
curl -i -H "Accept: text/markdown" http://localhost:3000/about

# Check headers
curl -sI -H "Accept: text/markdown" http://localhost:3000/about | grep -E '(Content-Type|x-markdown-tokens|Content-Signal)'
```

Expected for markdown response:
- `Content-Type: text/markdown; charset=utf-8`
- `x-markdown-tokens: <number>`
- Body starts with `---` frontmatter

### Step 6: Update Documentation

Add to README:
- List of routes supporting markdown negotiation
- Example `curl` invocation
- Pointer to `Content-Signal` policy

## Rules

- Markdown body MUST exclude navigation, scripts, footers, and analytics
- Frontmatter MUST come from real metadata — don't guess title/description
- Resolve all relative URLs to absolute in the markdown body
- Always set the `Content-Signal` header on markdown responses (mirror robots.txt)
- For SPAs (React+Vite), stop early and document host-level (Vercel/Cloudflare) requirement — do not implement at app level
