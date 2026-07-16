---
name: browser-test-feature
description: Interactively test a feature by driving the real app in Chrome — login per role, walk the UI, inspect generated output (PDF/exports), report bugs
---

# Browser Test Feature

Drive the running app through the Claude-in-Chrome extension and functionally verify a feature the way a real user would. Usage: `/browser-test-feature warranty-filter` or `/browser-test-feature create-work-order`

This is **interactive functional QA**, not test-file authoring. It catches things Playwright-only testing misses: real generated output (PDFs, exports), role-gated UI as an actual user sees it, and multi-step flows across roles. For self-running CI tests, use `/test-flow` or `/test-page` instead.

## Constraint — read first

This skill drives the user's **live Chrome via the Claude-in-Chrome extension**, so it MUST run in the **main session (foreground)**. A background/headless subagent generally cannot reach the extension. Do not promise or attempt background execution. If the extension is unavailable, stop and tell the user — fall back to `/test-flow` (Playwright) rather than faking it.

## When to use

- Verifying a feature end-to-end before a PR, as a real user across roles
- Inspecting generated artifacts (PDF reports, exports) that Playwright can't easily render
- Confirming role-scoping (feature visible to manager, hidden from technician, etc.)
- Exercising edge inputs and filter combinations against the real backend

## When NOT to use

- Writing repeatable CI tests → `/test-flow`, `/test-page`, `/write-tests`
- Isolated component behavior → `/write-tests`
- Security/adversarial probing → not covered here (functional only)

## Pre-Work

1. READ the feature's views/components, stores/services, and models to understand its UI surface and data flow
2. READ @knowledge/26-browser-testing.md for the extension workflow and element-finding discipline
3. READ @knowledge/18-testing-patterns.md for selector discipline (prefer roles/labels/text over coordinates)
4. Identify the app URL (dev server), the login flow, and the roles the feature touches (e.g. manager vs technician)
5. Check the feature's translations/labels so you assert against real UI text, not guesses

## Steps

### Step 1: Start the browser session

Load the Chrome MCP tools in ONE batch, then get tab context before anything else:

```
ToolSearch: "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__find,mcp__claude-in-chrome__get_page_text"
```

Then call `tabs_context_mcp` (create a new tab for this session — do not reuse the user's tabs unless asked). Navigate to the app's login page.

### Step 2: Log in per role

For each role the feature touches, log in and note what changes. Use the app's real login (email + password fields → submit → wait for redirect). Batch the fill/click/wait/screenshot steps with `browser_batch`.

```
Roles to cover (example): manager, technician, approver
For each: login → confirm landing → note which nav/actions are visible
```

Never enter real production credentials or secrets — only the dev/test accounts the user provides.

### Step 3: Map the feature's UI surface

Before testing, screenshot the feature area and use `find` / `read_page` to locate its controls (filters, buttons, form fields, tabs). Note stable anchors (roles, labels, visible text) rather than relying only on pixel coordinates.

### Step 4: Walk the happy path per role

Exercise the feature's primary flow as each relevant role:

```
Feature: Warranty filter
1. Manager → Work Orders → Filter → Warranty = Yes → assert result count changes correctly
2. Manager → Warranty = No → assert complementary set
3. Technician → same view → assert filter is absent (if role-gated)
```

Assert against real UI (result counts, visible rows, URL query params, toasts). Screenshot each meaningful state.

### Step 5: Edge inputs and persistence

Push past the happy path:

- Empty / whitespace-only / very long / special-character inputs where the feature accepts text
- Required-field validation (submit incomplete forms)
- Filter combinations (feature filter + status/other filters — assert AND behavior and counts add up)
- Deep-link: open the feature's URL with query params directly → assert state hydrates
- Refresh (F5) → assert state persists
- Clear/reset → assert it returns to baseline

### Step 6: Verify generated output

If the feature produces artifacts (PDF report, CSV/export), generate them for a case that should include the data AND a case that should omit it. Read the downloaded file to confirm:

```
- Locate the download (e.g. ~/Downloads/*.pdf) via Bash
- Read the PDF/file and assert the expected section is present / absent
- Confirm labels, values, and conditional sections render as designed
```

Some artifacts are only available after a status change (e.g. a report enabled only after sign-off). If so, drive the required flow to reach that state, noting the data mutation.

### Step 7: Role-scoping check

Confirm the feature respects role boundaries: visible/editable where it should be, hidden/read-only where it shouldn't. Compare the same record across roles.

### Step 8: Report

Summarize findings using the Bug Report Format below, most-severe first. State clearly what passed, what failed, and any dev-data mutations you made.

## Bug Report Format

```
## Bug: {Title}

**Severity**: P0/P1/P2/P3
**Role**: manager / technician / ...
**Page**: /work-orders

### Steps to Reproduce
1. Login as manager
2. Open Work Orders → Filter
3. Set Warranty = Yes

### Expected
Result count reflects only warranty work orders

### Actual
Count unchanged / wrong rows shown

### Evidence
[screenshot path or read-back of generated file]
```

Severity: P0 critical (data integrity, auth, core flow broken) · P1 high (feature broken/validation) · P2 medium (edge cases, minor UX) · P3 low (cosmetic).

## Rules

- Run in the **main session** — never rely on the extension from a background subagent
- Call `tabs_context_mcp` before any other browser tool; create a fresh tab for the session
- Prefer `browser_batch` for multi-step sequences (login, form fill) — one round trip, not many
- Prefer stable anchors (`find`, roles, visible text) over raw coordinates; re-screenshot after actions that resize/reflow the window
- Never enter real credentials, payment details, or secrets — only dev/test accounts the user provides
- Never perform destructive or irreversible actions (delete, hard sign-off, publish) without noting it and, when meaningful, confirming with the user first
- **Report every dev-DB mutation you make** (created records, status changes) — the environment is left changed
- Assert against real UI text/counts/URLs, not assumptions; verify generated files by reading them, not by trusting the success toast
- Functional testing only — no adversarial/security probing in this skill
