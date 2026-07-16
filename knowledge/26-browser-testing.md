# Browser Testing (Claude-in-Chrome)

Interactive functional testing that drives the **real running app** through the Claude-in-Chrome extension. This complements — does not replace — Playwright (`@knowledge/18-testing-patterns.md`). Use it for verifying a feature as a real user across roles, inspecting generated artifacts (PDFs/exports), and confirming role-scoped UI. Reach for it via the `/browser-test-feature` skill or the `browser-qa` agent.

## The extension model & main-session constraint

The browser MCP tools (`mcp__claude-in-chrome__*`) act on the user's **live Chrome** via an interactive extension. This works reliably only in the **main session (foreground)**. A background/headless subagent generally cannot reach the extension.

- Always run browser testing in the main session.
- If the extension is unavailable, STOP — do not fake results. Fall back to Playwright (`/test-flow`, `/test-page`).
- Never reuse tab IDs from a previous session; they are session-specific.

## Session start

Load the tools you'll need in ONE `ToolSearch` call (the extension tools are often deferred), then get tab context before any other browser action:

```
ToolSearch: "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__find,mcp__claude-in-chrome__get_page_text"
```

Then:

1. `tabs_context_mcp` — see existing tabs. Create a NEW tab (`tabs_create_mcp`) for this session; do not hijack the user's tabs unless asked.
2. `navigate` to the app's dev URL (e.g. `http://localhost:5173`).
3. If a browser tool later errors with an invalid/closed tab, re-call `tabs_context_mcp` for fresh IDs.

## browser_batch — batch multi-step sequences

Each standalone tool call is a round trip. When you can predict several steps ahead (login fill/click/wait/screenshot, form entry), send them in one `browser_batch`. Actions run sequentially and stop on the first error. Coordinates in a batch refer to the screenshot taken BEFORE the batch — don't chain clicks across a reflow inside one batch without a fresh screenshot.

```
browser_batch:
  - computer.left_click  (email field)
  - computer.type        (dev email)
  - computer.left_click  (password field)
  - computer.type        (dev password)
  - computer.left_click  (submit)
  - computer.wait        (2-3s)
  - computer.screenshot
```

## Login per role

Most features behave differently per role. Cover each relevant role (e.g. manager, technician, approver):

- Use the app's real login form with the **dev/test accounts the user provides** — never real credentials or secrets.
- After login, confirm the landing and note which nav items / actions / columns are visible for that role.
- To switch roles: open the user menu → log out → log in as the next account. Re-screenshot after logout since the window often reflows.

## Finding elements — discipline

Prefer stable anchors over pixel-hunting:

- `find` (natural-language) and `read_page` (accessibility tree) locate elements and return references you can click by `ref`.
- Anchor on roles, labels, and visible text — the same discipline as `@knowledge/18-testing-patterns.md` (getByRole/getByLabel/getByText, never CSS/positional).
- Use `computer` coordinates only when necessary, and **re-screenshot after any action that resizes or reflows** the window (modals opening, viewport changes) — stale coordinates click the wrong thing.
- `get_page_text` extracts readable content for assertions on rendered text.

## Verifying generated output

Artifacts (PDF reports, CSV exports) are the highest-value thing this testing catches, because Playwright can't easily render them. Verify by READING the file, not by trusting a success toast:

1. Trigger the export/download in the UI.
2. Locate the file via Bash (e.g. `ls -t ~/Downloads/*.pdf | head`).
3. `Read` the PDF/file and assert: expected sections present, conditional sections correctly present/omitted, labels and values correct.
4. Test BOTH a case that should include the data and one that should omit it (e.g. a report section that only appears when its field is non-empty).

Some artifacts are gated behind a status change (e.g. a report enabled only after sign-off). Drive the required flow to reach that state — and record the mutation in your report.

## Role-scoping verification

Open the same record as different roles and compare: a control/field/column visible to one role should be correctly hidden or read-only for another. This is a common source of leaks (e.g. a manager-only filter or an internal note showing up on a technician view).

## Leaving the environment honest

This testing hits the **real backend**, so it mutates the dev database (created records, status changes, signatures). Always:

- Note every mutation you make in the final report.
- Avoid destructive/irreversible actions (delete, hard sign-off, publish) unless the test requires it and you've flagged it (confirm with the user when meaningful).
- If a clean seed matters afterward, tell the user the DB was changed so they can reset.

## Avoiding dialogs

Do not trigger native JS dialogs (`alert`/`confirm`/`prompt`) — they block the extension from receiving further commands. Prefer console logging + `read_console_messages` for debugging, and avoid clicking controls that spawn a browser modal dialog mid-flow.

## Relationship to Playwright

- **This (browser-qa / `/browser-test-feature`)**: interactive, real-backend, real-artifact, role-driven verification in the main session. Not repeatable in CI.
- **Playwright (`qa-tester` / `/test-flow` / `/test-page` / `/write-tests`)**: self-running, CI-friendly `.spec` files. The path for regression coverage.

Use browser testing to explore and verify a feature before a PR; encode the durable cases as Playwright tests afterward.
