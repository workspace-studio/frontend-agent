---
name: seo-audit
description: Run SEO audit on a Next.js project — check metadata, sitemaps, robots, OG, structured data
---

# SEO Audit

Run SEO audit on a Next.js project. Usage: `/seo-audit` or `/seo-audit /about`

## Pre-Work

1. READ @knowledge/13-seo-metadata.md
2. Verify this is a Next.js project (SEO audit is not applicable to React SPAs)

## Steps

### Step 1: Scan Pages for Metadata

Search all `page.tsx` files for `generateMetadata` exports. Flag pages missing it.

### Step 2: Check Root Layout

Verify root `layout.tsx` has:
- `generateMetadata` with title template, description, OG, Twitter, icons
- JSON-LD structured data (`dangerouslySetInnerHTML`)
- Proper locale handling

### Step 3: Check SEO Infrastructure

- `robots.ts` — exists and disallows protected paths per locale
- `sitemap.ts` or `sitemap.xml/route.ts` — generates all public URLs
- OG image at `/public/meta/og-image.png` (1200x630)
- Favicon set in `/public/favicons/`

### Step 4: Check Alternates

Verify `alternates.languages` on pages for proper hreflang tags.

### Step 5: Produce Report

Use the structured format:

```
## SEO Audit Report

### Critical Issues
- [{file}:{line}] {description} — {suggested fix}

### Warnings
- [{file}:{line}] {description} — {suggested fix}

### Suggestions
- [{file}:{line}] {description}

### Summary
{X} critical, {Y} warnings, {Z} suggestions
```

### Step 6: Fix Issues (if requested)

Implement fixes for critical issues, then re-audit to verify.
