---
name: setup-api-catalog
description: Add or audit an RFC 9727 API Catalog at /.well-known/api-catalog using the Linkset format
---

# Setup API Catalog

Add or audit a machine-readable API catalog so AI agents can discover the project's APIs. Usage: `/setup-api-catalog` or `/setup-api-catalog audit`

## Pre-Work

1. READ @knowledge/25-agent-protocols.md (section 1)
2. READ @knowledge/20-api-routes.md
3. Detect stack from package.json (next → Next.js, vite → SPA — note SPA needs server functions)

## Steps

### Step 1: Inventory Existing APIs

Search the project for existing API endpoints:

- Next.js: `src/app/**/route.ts`, `src/app/api/**`
- React+Vite: scan `src/services/*.service.ts` for endpoint URLs

Build a list of `{ url, title, type, docUrl?, specUrl? }`.

### Step 2: Confirm with User

Ask the user:
- Site origin (e.g., `https://workspace.hr`)
- Which APIs to expose publicly in the catalog
- Which APIs have OpenAPI specs (`service-desc`)
- Which APIs have human docs (`service-doc`)

### Step 3: Create the Route Handler (Next.js)

Create `src/app/.well-known/api-catalog/route.ts` returning a valid Linkset (RFC 9264).

- `Content-Type: application/linkset+json`
- Add `Cache-Control: public, max-age=3600`
- Add `Access-Control-Allow-Origin: *` so cross-origin agents can fetch

Each API gets:
- One `item` entry under the catalog anchor
- One linkset block anchored at the API URL with `service-doc` and/or `service-desc`

### Step 4: SPA Note

If stack is React+Vite, STOP and inform the user that this protocol must be served by their host (Vercel Edge Functions, Cloudflare Pages Functions, custom Node server). Provide a copy-paste handler example.

### Step 5: Validate

```bash
# Local dev
curl -i http://localhost:3000/.well-known/api-catalog

# Verify shape
curl -s http://localhost:3000/.well-known/api-catalog | jq '.linkset[0].profile'
```

Expected: status 200, `Content-Type: application/linkset+json`, valid JSON with `linkset` array.

### Step 6: Update Documentation

Add a one-line mention in the project README pointing to the catalog URL.

## Rules

- Only list APIs that actually exist — never fabricate endpoints
- Always include the `profile` link to RFC 9727 on the catalog anchor
- Always set CORS for `.well-known/*` so agents on other origins succeed
- Do not expose admin/internal APIs in the catalog
