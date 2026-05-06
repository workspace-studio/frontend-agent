# Agent Discovery Protocols

Modern web standards that let AI agents discover APIs, respect content usage policies, and consume content efficiently. Based on the **Agent Skills Discovery RFC v0.2.0**.

Three protocols are covered here:

1. **API Catalog Discovery** — RFC 9727
2. **Content Signals** — robots.txt directives
3. **Markdown Content Negotiation** — `Accept: text/markdown`

---

## 1. API Catalog Discovery (RFC 9727)

### What It Is

A machine-readable document at `/.well-known/api-catalog` that describes available APIs, their docs, and metadata. Uses the **Linkset** format (RFC 9264).

### Discovery Flow

1. Locate catalog: `GET /.well-known/api-catalog`
2. Parse JSON Linkset
3. Identify APIs via `item` link relation
4. Follow `service-doc`, `service-desc`, `service-meta` links

### Link Relations

| Relation | Meaning |
|----------|---------|
| `item` | Identifies an API in the catalog |
| `service-desc` | Machine-readable spec (OpenAPI, WSDL) |
| `service-doc` | Human-readable docs (HTML, PDF) |
| `service-meta` | Metadata (privacy, terms) |
| `status` | Operational health |
| `profile` | Marks document as RFC 9727 catalog |

### Example Linkset

```json
{
  "linkset": [
    {
      "anchor": "https://workspace.hr/.well-known/api-catalog",
      "profile": [{ "href": "https://www.rfc-editor.org/info/rfc9727" }],
      "item": [
        {
          "href": "https://workspace.hr/api/bookings",
          "type": "application/json",
          "title": "Bookings API"
        }
      ]
    },
    {
      "anchor": "https://workspace.hr/api/bookings",
      "service-desc": [
        { "href": "https://workspace.hr/api/bookings/openapi.json", "type": "application/openapi+json" }
      ],
      "service-doc": [
        { "href": "https://workspace.hr/docs/bookings", "type": "text/html" }
      ]
    }
  ]
}
```

### Next.js Implementation

`src/app/.well-known/api-catalog/route.ts`:

```ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: 'https://workspace.hr/.well-known/api-catalog',
        profile: [{ href: 'https://www.rfc-editor.org/info/rfc9727' }],
        item: [
          {
            href: 'https://workspace.hr/api/bookings',
            type: 'application/json',
            title: 'Bookings API',
          },
        ],
      },
    ],
  };

  return NextResponse.json(linkset, {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

### Client-Side Discovery (reference)

```js
const res = await fetch('https://workspace.hr/.well-known/api-catalog');
const catalog = await res.json();

const apis = catalog.linkset
  .flatMap((ls) => ls.item || [])
  .map((item) => ({ url: item.href, type: item.type, title: item.title }));
```

### References

- RFC 9727 — https://www.rfc-editor.org/rfc/rfc9727
- RFC 9264 (Linkset) — https://www.rfc-editor.org/rfc/rfc9264
- RFC 8631 (service-desc/doc/meta) — https://www.rfc-editor.org/rfc/rfc8631
- RFC 8288 (Link headers) — https://www.rfc-editor.org/rfc/rfc8288

---

## 2. Content Signals

### What It Is

Machine-readable directives in `robots.txt` that declare how AI systems may use site content. See https://contentsignals.org/.

### Signal Types

| Signal | Meaning |
|--------|---------|
| `search` | Building a search index |
| `ai-input` | Real-time AI answers (RAG, agents) |
| `ai-train` | Training/fine-tuning models |

Each signal is `yes` (allow) or `no` (forbid).

### robots.txt Example

```
User-agent: *
Allow: /

Content-Signal: search=yes, ai-train=yes, ai-input=yes
```

### Next.js Implementation

`MetadataRoute.Robots` (the typed `robots.ts` API) does not directly support `Content-Signal`. Two options:

**Option A — Custom `route.ts` returning text/plain:**

```ts
// src/app/robots.txt/route.ts
export function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    '',
    'Content-Signal: search=yes, ai-train=yes, ai-input=yes',
    '',
    'Sitemap: https://workspace.hr/sitemap.xml',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

**Option B — Hybrid:** keep `robots.ts` for typed rules and add `Content-Signal` via raw injection in a wrapper route handler.

### Reading Content Signals (reference)

```js
const robotsTxt = await fetch('https://workspace.hr/robots.txt').then((r) => r.text());

const line = robotsTxt
  .split('\n')
  .find((l) => l.startsWith('Content-Signal:'))
  ?.replace('Content-Signal:', '')
  .trim();

const signals = Object.fromEntries(
  (line || '').split(',').map((pair) => {
    const [key, value] = pair.trim().split('=');
    return [key, value === 'yes'];
  })
);

if (signals['ai-train']) {
  // training allowed
}
```

### References

- Content Signals — https://contentsignals.org/

---

## 3. Markdown Content Negotiation

### What It Is

Agents request `Accept: text/markdown` to receive a clean, token-efficient markdown version of an HTML page. Server returns markdown with YAML frontmatter and minimal noise.

### Benefits

- Reduced tokens vs HTML
- Structured (no nav/footer/scripts)
- Metadata via YAML frontmatter
- Optional `x-markdown-tokens` hint header

### Request

```
GET /about HTTP/1.1
Host: workspace.hr
Accept: text/markdown
```

### Response

```
HTTP/1.1 200 OK
Content-Type: text/markdown; charset=utf-8
x-markdown-tokens: 1234
Content-Signal: ai-train=yes, search=yes, ai-input=yes

---
title: About Workspace
description: We build modern web tooling.
image: /meta/og-about.png
---

# About Workspace

Body content...

```json
{ "@context": "https://schema.org", "@type": "Organization" }
```
```

### Body Structure

1. **YAML frontmatter** — title, description, image (from `<meta>` tags)
2. **Markdown body** — content only (no nav/footer/scripts)
3. **JSON-LD** (optional) — fenced code block

### Next.js Implementation

There are several patterns. The simplest is a content-aware route segment:

```ts
// src/app/[locale]/about/route-md.ts (helper)
import { headers } from 'next/headers';

export async function shouldServeMarkdown() {
  const accept = (await headers()).get('accept') || '';
  return accept.includes('text/markdown');
}
```

For routes with mostly static content, generate the markdown alongside the page at build time and select via middleware.

**Cloudflare Pages**: provides automatic HTML→markdown conversion through Pages Functions. **Vercel**: implement at the application level.

### Implementation Notes

- Strip `<script>`, `<style>`, `<nav>`, `<footer>` before conversion
- Preserve heading hierarchy
- Resolve relative URLs to absolute
- Include the `Content-Signal` header on markdown responses too
- Cache aggressively (markdown bodies rarely change without an HTML change)

### References

- Agent Skills Discovery RFC — https://github.com/cloudflare/agent-skills-discovery-rfc

---

## Audit Checklist (Quick)

- [ ] `GET /.well-known/api-catalog` returns valid Linkset JSON
- [ ] Catalog lists every public API with `service-doc` or `service-desc`
- [ ] `robots.txt` contains `Content-Signal:` with explicit `yes`/`no` values
- [ ] At least key public pages support `Accept: text/markdown`
- [ ] Markdown responses include frontmatter and exclude navigation
- [ ] Optional headers set: `x-markdown-tokens`, `Content-Signal`
- [ ] CORS allows agent fetches on `.well-known/*`

## Testing Commands

```bash
# API Catalog
curl -i https://workspace.hr/.well-known/api-catalog

# Content Signals
curl -s https://workspace.hr/robots.txt | grep -i 'content-signal'

# Markdown negotiation
curl -i -H "Accept: text/markdown" https://workspace.hr/about
```

## Common Pitfalls

- Returning `application/json` instead of `application/linkset+json` for the catalog (acceptable but less specific)
- Forgetting CORS on `.well-known/*` — agents on other origins fail to fetch
- Adding `Content-Signal` only to the default UA stanza when project policy applies globally — put it once at top level
- Markdown responses that include nav links — defeats the token-efficiency purpose
- Treating an SPA as if it can serve these protocols on its own (it can't — needs server functions)
