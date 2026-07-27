# Frontend Agent

> AI-powered frontend expert for Claude Code — battle-tested patterns for **Next.js** and **React+Vite** with MUI, SCSS Modules, Valtio, and i18n.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [Skills (Slash Commands)](#2-skills-slash-commands)
3. [Capabilities](#3-capabilities)
4. [Project Structure](#4-project-structure)
5. [How It Works](#5-how-it-works)
6. [Example Tasks](#6-example-tasks)
7. [What Gets Installed](#7-what-gets-installed)
8. [Troubleshooting](#8-troubleshooting)
9. [Architecture Reference](#9-architecture-reference)

---

## 1. Quick Start

### Prerequisites

| Tool | Install |
|------|---------|
| Node.js 20+ | `brew install node` or [nvm](https://github.com/nvm-sh/nvm) |
| Git 2.x+ | `brew install git` |
| Claude Code | `npm i -g @anthropic-ai/claude-code` |
| GitHub CLI | `brew install gh` → `gh auth login` |

### Install the Agent

```bash
cd /path/to/your-frontend-project
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```

The installer auto-detects your stack (Next.js or React+Vite) and configures everything.

### Start Working

```bash
claude                    # Start Claude Code
# Type /agents → select "Next.js" or "React"
# Give it a task in natural language
```

### Bootstrap a New Project

Don't have a project yet? The agent can create one from scratch:

```
/bootstrap-nextjs my-landing — marketing site with MUI, next-intl (en/hr), SEO
/bootstrap-react my-app — dashboard with MUI, i18next (en/hr), Valtio, Axios
```

<details>
<summary><strong>Alternative install methods</strong></summary>

**Clone and install:**
```bash
git clone https://github.com/workspace-studio/frontend-agent.git /tmp/frontend-agent
cd /path/to/your-frontend-project
bash /tmp/frontend-agent/install.sh
```

**Manual setup (boilerplate):**

```bash
# Next.js
git clone https://github.com/workspace-studio/nextjs-boilerplate.git my-landing
cd my-landing && rm -rf .git && git init && yarn install
yarn add @mui/material @emotion/react @emotion/styled next-intl react-hook-form
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash

# React+Vite
git clone https://github.com/workspace-studio/react-vite-boilerplate.git my-app
cd my-app && rm -rf .git && git init && yarn install
yarn add @mui/material @emotion/react @emotion/styled valtio i18next react-i18next i18next-browser-languagedetector axios react-hook-form
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```
</details>

---

## 2. Skills (Slash Commands)

### Scaffolding

| Command | Description |
|---------|-------------|
| `/bootstrap-nextjs my-site — landing, en/hr` | New Next.js project from scratch |
| `/bootstrap-react my-app — dashboard, en/hr` | New React+Vite project from scratch |

### Components & Views

| Command | Description |
|---------|-------------|
| `/create-component Header — sticky nav with logo` | Component with SCSS module and index.ts |
| `/create-view Settings — user preferences page` | Page/view with routing and metadata |
| `/add-form ContactForm — name, email, message` | react-hook-form form with validation |
| `/add-shared-components` | Copy shared library (Form, FormInput, Select, DatePicker) |

### Content

| Command | Description |
|---------|-------------|
| `/add-blog — categories: development, design, ai` | Install the markdown blog system (Next.js): `files/` structure, md pipeline, typed categories, localized slug maps, listing + detail routes, JSON-LD, sitemap |
| `/create-blog` | Add one post from pasted text — md per locale with full translations, the two slug map entries, banner/card images, nothing else in the diff |

### State & Configuration

| Command | Description |
|---------|-------------|
| `/add-store bookings — list, modals, loading` | Valtio store with actions and service |
| `/setup-i18n add-locale de` | Add locale or translation keys |
| `/setup-theme — primary=#1976d2, font=Inter` | Complete MUI theme (6 files) |
| `/setup-forms https://figma.com/.../Inputs` | Form system — components + MUI input overrides from Figma |

### Testing

| Command | Description |
|---------|-------------|
| `/write-tests Header` | Playwright component tests |
| `/test-page /pricing` | Playwright E2E test for a page |
| `/test-flow checkout` | Playwright E2E test for a user flow |
| `/browser-test-feature warranty-filter` | Interactive functional QA — drive the real app in Chrome per role, inspect generated output (main session only) |

### Figma Integration

| Command | Description |
|---------|-------------|
| `/figma-to-component Frame123` | Generate component from Figma design |
| `/sync-tokens` | Extract Figma design tokens → MUI theme |
| `/figma-review Header` | Compare implementation vs Figma design |

### Workflow

| Command | Description |
|---------|-------------|
| `/fix-issue 42` | Analyze, fix GitHub issue, create PR |
| `/create-pr` | Branch, commit, push, open PR |
| `/refactor extract shared card component` | Safe refactoring, keeps build green |
| `/seo-audit` | Full SEO audit (Next.js) |
| `/deploy` | Deploy to Vercel with pre-flight checks |

### AI Agent Protocols

| Command | Description |
|---------|-------------|
| `/agent-protocols-audit` | Audit API Catalog, Content Signals, Markdown negotiation |
| `/setup-api-catalog` | Add RFC 9727 API Catalog at `/.well-known/api-catalog` |
| `/setup-content-signals` | Add `Content-Signal:` directives to robots.txt |
| `/setup-markdown-negotiation` | Serve markdown via `Accept: text/markdown` |

---

## 3. Capabilities

### Next.js

| Capability | Knowledge File |
|------------|----------------|
| App Router pages, metadata, i18n, error/404 architecture | `10-nextjs-app-router.md` |
| Middleware auth: route protection, token refresh, cookies | `10-nextjs-app-router.md` |
| Server actions: useTransition, ActionResponse, typed params | `12-api-integration.md` |
| Server/client components with MUI, SCSS, translations | `03-component-patterns.md` |
| SEO: metadata, sitemaps, robots, JSON-LD, OG images | `13-seo-metadata.md` |
| next-intl routing, messages, locale-aware navigation | `08-i18n-nextintl.md` |
| API routes, middleware, validation | `20-api-routes.md` |
| AI agent protocols: API Catalog, Content Signals, Markdown negotiation | `25-agent-protocols.md` |

### React+Vite

| Capability | Knowledge File |
|------------|----------------|
| Views with routing, lazy loading, access control | `11-react-vite-routing.md` |
| Valtio stores with actions, modal state, loading | `06-state-management.md` |
| Axios services with token refresh, error handling | `12-api-integration.md` |
| i18next with namespaces, 4+ locales | `09-i18n-i18next.md` |
| PWA: service workers, offline mode, install prompt | `16-pwa-setup.md` |

### Both Stacks

| Capability | Knowledge File |
|------------|----------------|
| MUI theming (colors, typography, component overrides) | `04-mui-theming.md` |
| SCSS modules, mixins, rem-calc, BEM naming | `05-scss-patterns.md` |
| react-hook-form with validation and translations | `07-forms-validation.md` |
| Playwright component and E2E tests | `18-testing-patterns.md` |
| Shared components (Form, FormInput, Select, DatePicker) | `19-shared-components.md` |
| Figma design-to-code, token sync, visual review | `21-figma-integration.md` |
| Performance: image optimization, code splitting | `14-performance.md` |
| Accessibility: ARIA, semantic HTML, keyboard navigation | `15-accessibility.md` |
| Code review: patterns, accessibility, performance | `01-code-style.md` |
| Git workflow, branching, PR process | `17-git-and-pr-workflow.md` |

The agent reads only the knowledge files relevant to your task, keeping context efficient.

---

## 4. Project Structure

### Next.js

```
src/
├── app/                          # App Router
│   ├── error.tsx                 # Root error fallback (hardcoded EN, no i18n)
│   ├── not-found.tsx             # Root 404 fallback (hardcoded EN, no i18n)
│   ├── robots.ts                 # robots.txt generation
│   ├── sitemap.ts                # Sitemap generation
│   └── [locale]/                 # Dynamic locale segment
│       ├── layout.tsx            # Root layout (providers, metadata, JSON-LD)
│       ├── providers.tsx         # ThemeProvider + Toast
│       ├── error.tsx             # Locale error (layout providers available)
│       ├── not-found.tsx         # Locale 404
│       ├── [...rest]/page.tsx    # Catch-all → notFound() (required)
│       ├── (home)/page.tsx       # Home page → imports from views/
│       └── (public)/             # Public pages (about, contact, blog)
├── components/                   # Reusable UI components (PascalCase/)
│   ├── Header/                   # Header.tsx + Header.module.scss + index.ts
│   └── SvgIcons/                 # SVG icons grouped by category
│       └── Locales/              # EnFlag.tsx, HrFlag.tsx + index.ts
├── views/                        # Page-level view components
│   ├── Home/HeroSection/         # Section-level breakdown
│   ├── ErrorPage/                # useTranslations('errors')
│   └── NotFoundPage/             # useTranslations('errors')
├── i18n/                         # routing.ts, request.ts, navigation.ts, global.d.ts
├── proxy.ts                      # next-intl routing (Next.js 16) or middleware.ts (15)
├── config/                       # Static data (*.config.ts)
│   ├── meta.config.ts            # Site metadata
│   ├── navigation.config.ts      # Nav items, tabs, sidebar links
│   └── languages.config.ts       # Language picker options
├── valtio/global/                # Global store (toast, isFormDirty)
├── styles/                       # SCSS: globals, mixins, settings, themes/
└── utils/                        # hooks/, static/
```

### React+Vite

```
src/
├── components/                   # Reusable UI components
├── views/                        # Page-level views + partials/
├── routers/AppRouter.tsx         # Routes with lazy loading + guards
├── valtio/                       # Store + actions per domain
├── services/                     # Axios service classes
├── config/                       # Axios, constants, form models, navigation
├── i18n/                         # i18next configuration
├── locales/                      # en/, hr/, ba/, rs/ JSON files
├── styles/                       # SCSS: globals, mixins, settings, themes/
└── utils/                        # hooks/, context/
```

### Layer Comparison

| Layer | Next.js | React+Vite |
|-------|---------|-----------|
| **Routing** | App Router + [locale] segments | React Router + AppRoute wrapper |
| **Pages** | `app/[locale]/page.tsx` → views/ | `views/` (lazy loaded) |
| **State** | Server state (SSR) + Valtio (optional) | Valtio proxy + actions |
| **API** | Server Actions / fetch | Axios service classes |
| **i18n** | next-intl (URL-based) | i18next (localStorage) |
| **SEO** | generateMetadata, sitemap.ts, robots.ts | N/A (SPA) |
| **Styling** | MUI + SCSS Modules | MUI + SCSS Modules |

---

## 5. How It Works

### Agent Workflow

Every task follows the same pattern:

```
1. Pre-Work     → reads CLAUDE.md, package.json, existing code patterns
2. Knowledge    → loads relevant knowledge files (@knowledge/*)
3. Implement    → creates/modifies files following project patterns
4. Translate    → adds translation keys to all configured locales
5. Validate     → yarn build && yarn lint (auto-fixes failures)
6. Summary      → reports files created/modified, build/lint status
```

### Automation (Hooks)

The installer configures hooks in `.claude/settings.json`:

| Trigger | Action |
|---------|--------|
| File edited (.tsx/.ts) | Auto-runs `npx eslint --fix` |
| `git commit` | Runs `yarn build && yarn lint` — blocks commit on failure |

### Subagents (Isolated Context)

Specialist tasks run in separate context to keep the main agent clean:

| Subagent | Role |
|----------|------|
| `component-creator` | Creates components with MUI, SCSS, translations |
| `seo-specialist` | SEO audit and fixes |
| `theme-implementor` | MUI theme setup |
| `i18n-specialist` | i18n configuration and translations |
| `qa-tester` | Playwright E2E test writing |
| `browser-qa` | Interactive functional QA — drives the real app in Chrome per role (main session only) |
| `code-reviewer` | Code review (read-only) |
| `agent-protocols-specialist` | API Catalog, Content Signals, Markdown negotiation |

### Rules (Always Enforced)

4 rule files are loaded every session:

| Rule | Key Constraints |
|------|----------------|
| `components.md` | PascalCase, index.ts barrel, SCSS modules, SVG icon pattern, config files, no `any`, no React.memo |
| `styles.md` | `@use` imports, rem-calc(), theme colors, BEM naming |
| `api.md` | Zod validation, requireAuth(), consistent error format |
| `git.md` | Flat branch names, `#{issue}: description` commits, no force push |

---

## 6. Example Tasks

<details>
<summary><strong>Next.js: New Landing Page</strong></summary>

```
Create a "Pricing" page at /pricing with:
- 3 plan cards (Basic, Pro, Enterprise) with features list
- Monthly/yearly toggle switch
- FAQ section with accordion
- generateMetadata with SEO title/description
- Translations in English and Croatian
- Responsive design (cards stack on mobile)
```
</details>

<details>
<summary><strong>React: Complete Feature Module</strong></summary>

```
Create a complete "Customers" feature with:
- Valtio store (customers list, selected, modals, loading)
- Service class with CRUD operations
- List view with table, search, pagination
- Create/edit modal with form (name, email, phone, company)
- Delete confirmation modal
- Translations in all 4 locales (en, hr, ba, rs)
- Add route to AppRouter (protected, ADMIN+USER access)
- Add navigation entry
```
</details>

<details>
<summary><strong>Both: New Component</strong></summary>

```
Create a "StatCard" component that shows:
- Icon (MUI icon passed as prop)
- Title (translated string)
- Value (number with formatting)
- Trend indicator (up/down arrow with percentage)
Use MUI Paper, Stack, Typography. SCSS module for custom styling.
Make it responsive (full width on mobile).
```
</details>

<details>
<summary><strong>Both: Setup MUI Theme</strong></summary>

```
Set up a complete MUI theme with:
- Primary color: #2563EB (blue)
- Secondary color: #1E293B (dark slate)
- Font: Inter for body, Poppins for headings
- Border radius: 12px for cards, 8px for buttons
- Custom button styles (contained, outlined, text)
- Custom TextField with filled variant
```
</details>

<details>
<summary><strong>Next.js: SEO Audit</strong></summary>

```
Run a full SEO audit of this project. Check:
- Every page has generateMetadata
- Sitemap includes all routes
- robots.ts is configured correctly
- OG images exist and are correct size
- JSON-LD structured data is present
Fix any issues you find.
```
</details>

<details>
<summary><strong>Both: Code Review</strong></summary>

```
Review the Header component and its sub-components for:
- Accessibility issues
- Performance problems
- Pattern compliance
- Styling consistency
Produce a structured review with critical issues, warnings, and suggestions.
```
</details>

**Tips:**
- Use skills for common workflows — faster and more consistent
- Be specific: "Pricing page with 3 cards, toggle, FAQ, SEO, en/hr translations"
- Reference existing work: "Follow the same pattern as the Header component"
- One task at a time for best results

---

## 7. What Gets Installed

```
your-project/
├── CLAUDE.md                      # Project context (auto-generated)
└── .claude/
    ├── agents/                    # 2 main + 8 subagents
    │   ├── nextjs.md / react.md   # Main agents (loaded per session)
    │   └── component-creator, seo-specialist, theme-implementor,
    │       i18n-specialist, qa-tester, browser-qa, code-reviewer,
    │       agent-protocols-specialist
    ├── skills/                    # 28 slash commands (loaded on-demand)
    ├── knowledge/                 # 28 reference files (loaded on-demand)
    ├── examples/                  # 11 working code templates
    ├── rules/                     # 4 enforcement rules (loaded every session)
    │   └── components, styles, api, git
    └── settings.json              # Hooks (auto-lint, pre-commit validation)
```

**How it loads:**
- **Agents** — core instructions loaded every session (~200 lines each)
- **Rules** — constraints enforced every session (component patterns, styling, API, git)
- **Skills** — workflows loaded only when you invoke a slash command
- **Knowledge** — deep reference loaded on-demand when relevant to task
- **Examples** — code templates the agent uses as patterns

### Version Control

```bash
git add .claude/ && git commit -m "chore: add Frontend AI agent"
```

### Updating

```bash
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```

---

## 8. Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails: "Module not found"** | Check `tsconfig.json` has `@/*` path alias. For Vite, check `vite.config.ts` resolve.alias |
| **SCSS errors** | Vite: `css.preprocessorOptions.scss.api` should be `'modern'`. Next.js: check `sassOptions` |
| **Translation key not found** | Next.js: verify import in `request.ts` + `global.d.ts` + `createMessagesDeclaration` array. React: check `i18n.ts` ns array + all locale JSON files |
| **MUI theme not applying** | Verify `ThemeProvider` wraps app in `providers.tsx` (Next.js) or `App.tsx` (React) |
| **"use client" errors** | Add `'use client'` at top of file. Only where needed — server components by default |
| **Valtio store not updating** | Use `useSnapshot()` in components, not proxy directly. Mutations only in actions |
| **Agent not in /agents** | Run `ls .claude/agents/` — if missing, re-run installer |
| **404 shows English on /hr routes** | Create `[locale]/[...rest]/page.tsx` catch-all that calls `notFound()` |
| **`global.d.ts` breaks with linter** | Use relative import `./routing` not `@/i18n/routing` |
| **Button loses locale on click** | Use `Button component={Link} href="/"` with Link from `@/i18n/navigation` |
| **Port already in use** | `lsof -i :3000` → `kill <PID>` |

---

## 9. Architecture Reference

```
┌──────────────────────────────────────────────────────┐
│                     Claude Code                       │
│                                                       │
│  ┌──────────┐  ┌──────────┐                           │
│  │ nextjs.md │  │ react.md │   Main Agents (per session)│
│  └─────┬─────┘  └─────┬────┘                           │
│        └───────┬───────┘                               │
│                │                                       │
│  ┌─────────────┴──────────────┐                        │
│  │       6 Subagents          │  (isolated context)    │
│  │  component-creator         │                        │
│  │  seo-specialist            │                        │
│  │  theme-implementor         │                        │
│  │  i18n-specialist           │                        │
│  │  qa-tester                 │                        │
│  │  code-reviewer             │                        │
│  └─────────────┬──────────────┘                        │
│                │                                       │
│     ┌──────────┼──────────┐                            │
│     │          │          │                            │
│  ┌──┴───┐  ┌──┴────┐  ┌──┴──────────┐                 │
│  │Rules │  │Skills │  │Knowledge    │                 │
│  │  4   │  │  20   │  │  22 files   │                 │
│  │always│  │on-demand│ │  + 9 examples│                │
│  └──────┘  └───────┘  └─────────────┘                 │
└──────────────────────────────────────────────────────┘
```

### Knowledge Files (21)

| # | File | Topic |
|---|------|-------|
| 01 | `code-style` | ESLint, Prettier, naming conventions |
| 02 | `project-structure` | Next.js vs React folder layouts |
| 03 | `component-patterns` | Component structure, SCSS modules, barrels |
| 04 | `mui-theming` | Colors, palette, typography, overrides |
| 05 | `scss-patterns` | SCSS modules, mixins, rem-calc |
| 06 | `state-management` | Valtio proxy + actions |
| 07 | `forms-validation` | react-hook-form patterns |
| 08 | `i18n-nextintl` | next-intl setup, error pages, common pitfalls |
| 09 | `i18n-i18next` | i18next (React+Vite) |
| 10 | `nextjs-app-router` | Layouts, pages, metadata, error/404 architecture |
| 11 | `react-vite-routing` | React Router, lazy loading, guards |
| 12 | `api-integration` | Axios config, services, server actions |
| 13 | `seo-metadata` | Metadata API, sitemaps, JSON-LD, OG |
| 14 | `performance` | Image optimization, code splitting |
| 15 | `accessibility` | ARIA, semantic HTML, keyboard nav |
| 16 | `pwa-setup` | Service workers, offline mode |
| 17 | `git-and-pr-workflow` | Branching, commit conventions |
| 18 | `testing-patterns` | Playwright component and E2E tests |
| 19 | `shared-components` | Form, FormInput, Select, DatePicker |
| 20 | `api-routes` | Next.js API routes, middleware |
| 21 | `figma-integration` | Figma MCP, token mapping, Code Connect |
| 25 | `agent-protocols` | API Catalog (RFC 9727), Content Signals, Markdown negotiation |

### Example Templates (9)

| Example | Contents |
|---------|----------|
| `valtio-store/` | Valtio store with proxy, useSnapshot, async CRUD + global store (toast) |
| `service/` | Axios service class with static methods |
| `theme/` | Complete MUI theme (6 files) |
| `i18n-nextintl/` | next-intl routing, request, navigation, global.d.ts, proxy |
| `i18n-i18next/` | i18next with LanguageDetector |
| `nextjs-page/` | Page with generateMetadata and view import |
| `react-view/` | View component with list pattern |
| `component/` | Component + SCSS module + barrel export |
| `shared-components/` | Form, FormInput, Select, DatePicker |

---

Built by [Workspace Studio](https://github.com/workspace-studio)
