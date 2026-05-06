---
name: agent-protocols-audit
description: Audit a project for AI agent discovery protocols — API Catalog, Content Signals, Markdown negotiation
---

# Agent Protocols Audit

Run a full audit of AI agent discovery protocols. Usage: `/agent-protocols-audit` or `/agent-protocols-audit https://workspace.hr`

## Pre-Work

1. READ @knowledge/25-agent-protocols.md
2. Detect stack from package.json
3. Determine base URL: localhost for dev, the provided URL otherwise

## Steps

### Step 1: API Catalog Check

```bash
curl -i {BASE_URL}/.well-known/api-catalog
```

Verify:
- Status 200
- `Content-Type` is `application/linkset+json` or `application/json`
- Body parses as JSON
- `linkset` array exists
- At least one block has `profile` pointing at RFC 9727
- Each `item` entry has a `href`
- API anchors include `service-doc` or `service-desc`

### Step 2: Content Signals Check

```bash
curl -s {BASE_URL}/robots.txt
```

Verify:
- robots.txt is reachable
- Contains a `Content-Signal:` line
- Declares all three signals: `search`, `ai-input`, `ai-train`
- Values are `yes` or `no` (no missing/blank)

### Step 3: Markdown Negotiation Check

Pick 1–3 representative public pages (home, about, a content page).

```bash
curl -i -H "Accept: text/markdown" {BASE_URL}/{path}
```

Verify per page:
- Status 200
- `Content-Type: text/markdown; charset=utf-8`
- Body starts with `---` (YAML frontmatter)
- Frontmatter includes at least `title` and `description`
- Body contains no `<script>` or `<nav>` HTML
- Optional: `x-markdown-tokens` header present
- Optional: `Content-Signal` header mirrors robots.txt

### Step 4: CORS Check

```bash
curl -i -H "Origin: https://example.com" {BASE_URL}/.well-known/api-catalog
```

Verify `Access-Control-Allow-Origin` is set so cross-origin agents can fetch.

### Step 5: Produce Report

```
## Agent Protocols Audit Report

### API Catalog (RFC 9727)
- Status: {present|missing|broken}
- URL: {BASE_URL}/.well-known/api-catalog
- APIs listed: {N}
- Issues:
  - [{location}] {description} — {fix}

### Content Signals
- Status: {present|missing}
- URL: {BASE_URL}/robots.txt
- Signals: search={yes|no|missing}, ai-input={...}, ai-train={...}
- Issues:
  - [{location}] {description} — {fix}

### Markdown Negotiation
- Status: {supported|partial|not supported}
- Coverage: {X of Y tested routes}
- Issues:
  - [{path}] {description} — {fix}

### Summary
{overall assessment} — {X} critical, {Y} warnings, {Z} suggestions
```

### Step 6: Fix Issues (if requested)

For each missing protocol, invoke the corresponding setup skill:
- `/setup-api-catalog`
- `/setup-content-signals`
- `/setup-markdown-negotiation`

Re-run the audit afterwards to confirm green.

## Rules

- Only verify what is reachable — never assume protocol presence
- Report exact URLs and headers in findings so the user can reproduce
- Do not modify files in audit mode unless explicitly asked
- Honor existing project policies — do not propose `Content-Signal` values without user confirmation
