---
name: deploy
description: Deploy to Vercel with pre-flight checks and post-deploy verification
---

# Deploy

Deploy the project to Vercel. Usage: `/deploy` or `/deploy --prod`

## Pre-Work

1. Verify `vercel` CLI is available (`which vercel`)
2. Verify the project is linked to Vercel (`vercel whoami`)

## Steps

### Step 1: Pre-Flight Checks

Run all checks — abort if any fail:

```bash
git status                          # Must have clean working tree
yarn lint                           # Zero warnings
yarn build                          # Clean production build
yarn test:ct 2>/dev/null || true    # Tests — report if they fail
```

### Step 2: Deploy

For preview (default):

```bash
vercel
```

For production (when `--prod` is specified):

```bash
vercel --prod
```

Capture the deployment URL from the output.

### Step 3: Post-Deploy Verification

```bash
vercel inspect {deployment-url}
```

Verify:
- Deployment status is "READY"
- No build errors in deployment logs

Check the deployment responds:

```bash
curl -s -o /dev/null -w "%{http_code}" {deployment-url}
```

Expected: 200

### Step 4: Report

```
## Deploy Summary

- **Environment**: preview / production
- **URL**: {deployment-url}
- **Status**: SUCCESS / FAILED
- **Pre-flight**: lint ✓, build ✓, tests ✓/skipped
```

### Step 5: Failure Handling

If deploy fails:

1. Run `vercel logs {deployment-url}` to get error details
2. Present the error to the user with suggested fix
3. Do NOT retry automatically — ask the user first

## Rules

- NEVER deploy with uncommitted changes
- NEVER deploy to production without explicit user confirmation
- Always run lint + build before deploying
- Report the deployment URL clearly so the user can verify
