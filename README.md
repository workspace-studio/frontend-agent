# Frontend Agent

> AI-powered frontend expert agent for Claude Code. Battle-tested patterns for Next.js and React+Vite projects with MUI, SCSS Modules, Valtio, and i18n.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Creating a New Project From Scratch](#2-creating-a-new-project-from-scratch)
3. [Installing Frontend Agent](#3-installing-frontend-agent-into-your-project)
4. [Invoking the Agent](#4-invoking-the-agent)
5. [What the Agent Can Do](#5-what-the-agent-can-do)
6. [Example Tasks](#6-example-tasks--copy-paste-ready)
7. [Project Structure](#7-understanding-the-project-structure)
8. [Development Workflow](#8-the-development-workflow)
9. [Troubleshooting](#9-troubleshooting)
10. [Architecture Reference](#10-architecture-reference)

---

## 1. Prerequisites

| Tool | Version | Install | Purpose |
|------|---------|---------|---------|
| Node.js | 20+ (LTS recommended) | `brew install node` or [nvm](https://github.com/nvm-sh/nvm) | JavaScript runtime |
| Git | 2.x+ | `brew install git` | Version control |
| Claude Code | Latest | `npm i -g @anthropic-ai/claude-code` | AI coding assistant |
| GitHub CLI | Latest | `brew install gh` → `gh auth login` | PR management |
| VS Code | Latest (optional) | [code.visualstudio.com](https://code.visualstudio.com) | Editor |

Verify installation:

```bash
node --version        # v20.x.x or higher
git --version         # git version 2.x.x
claude --version      # Claude Code vX.X.X
gh --version          # gh version X.X.X
```

---

## 2. Creating a New Project From Scratch

### Option A: Let the Agent Do It (Recommended)

Once you have the agent installed (see section 3), simply tell it:

**For a Next.js landing/marketing site:**
```
Bootstrap a new Next.js project called "my-landing" with:
- MUI theme, SCSS Modules
- next-intl with English and Croatian
- SEO setup (metadata, sitemap, robots)
- Home page with hero section
```

**For a React+Vite application/dashboard:**
```
Bootstrap a new React+Vite project called "my-app" with:
- MUI theme, SCSS Modules
- i18next with English and Croatian
- Valtio for state management
- Axios with token interceptor
- Login page and dashboard skeleton
```

The agent will scaffold the entire project, install dependencies, configure everything, and verify it builds.

### Option B: Manual Setup (Using Boilerplate)

**Next.js:**
```bash
git clone https://github.com/workspace-studio/nextjs-boilerplate.git my-landing
cd my-landing
rm -rf .git && git init
yarn install
yarn add @mui/material @emotion/react @emotion/styled next-intl react-hook-form
# Install the agent
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```

**React+Vite:**
```bash
git clone https://github.com/workspace-studio/react-vite-boilerplate.git my-app
cd my-app
rm -rf .git && git init
yarn install
yarn add @mui/material @emotion/react @emotion/styled valtio i18next react-i18next i18next-browser-languagedetector axios react-hook-form
# Install the agent
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```

---

## 3. Installing Frontend Agent Into Your Project

### Option A: One-Line Install (Recommended)

```bash
cd /path/to/your-frontend-project
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```

The installer automatically detects your stack (Next.js or React+Vite) and configures accordingly.

### Option B: Clone and Install

```bash
git clone https://github.com/workspace-studio/frontend-agent.git /tmp/frontend-agent
cd /path/to/your-frontend-project
bash /tmp/frontend-agent/install.sh
```

### Option C: Manual Copy

```bash
git clone https://github.com/workspace-studio/frontend-agent.git /tmp/frontend-agent
cd /path/to/your-frontend-project
mkdir -p .claude/{agents,knowledge,examples}
mkdir -p .claude/skills/{create-component,create-view,add-store,setup-i18n,setup-theme,add-form,seo-audit,bootstrap-nextjs,bootstrap-react,fix-issue,create-pr,refactor}
cp /tmp/frontend-agent/agents/*.md .claude/agents/
for s in /tmp/frontend-agent/skills/*/; do cp "$s"SKILL.md ".claude/skills/$(basename $s)/"; done
cp /tmp/frontend-agent/knowledge/*.md .claude/knowledge/
cp -r /tmp/frontend-agent/examples/* .claude/examples/
```

### What Gets Installed

```
your-project/
├── CLAUDE.md                           # Project-specific context (auto-generated)
└── .claude/
    ├── agents/
    │   ├── nextjs.md                   # Main agent: Next.js expert
    │   ├── react.md                    # Main agent: React+Vite expert
    │   ├── component-creator.md        # Subagent: creates components
    │   ├── seo-specialist.md           # Subagent: SEO audit & fixes
    │   ├── theme-implementor.md        # Subagent: MUI theme setup
    │   ├── i18n-specialist.md          # Subagent: i18n management
    │   └── code-reviewer.md            # Subagent: code review (read-only)
    ├── skills/
    │   ├── create-component/SKILL.md   # /create-component — new component
    │   ├── create-view/SKILL.md        # /create-view — new page/view
    │   ├── add-store/SKILL.md          # /add-store — Valtio store + actions
    │   ├── setup-i18n/SKILL.md         # /setup-i18n — add locale/keys
    │   ├── setup-theme/SKILL.md        # /setup-theme — MUI theme from scratch
    │   ├── add-form/SKILL.md           # /add-form — react-hook-form form
    │   ├── seo-audit/SKILL.md          # /seo-audit — SEO analysis
    │   ├── bootstrap-nextjs/SKILL.md   # /bootstrap-nextjs — new Next.js project
    │   ├── bootstrap-react/SKILL.md    # /bootstrap-react — new React project
    │   ├── fix-issue/SKILL.md          # /fix-issue — fix GitHub issue
    │   ├── create-pr/SKILL.md          # /create-pr — git + PR workflow
    │   └── refactor/SKILL.md           # /refactor — safe refactoring
    ├── knowledge/                      # 18 topic reference files
    │   └── 01 through 18-*.md
    ├── examples/                       # Reference code examples
    │   ├── valtio-store/               # Valtio store + actions pattern
    │   ├── service/                    # Axios service class pattern
    │   ├── theme/                      # Complete MUI theme (6 files)
    │   ├── i18n-nextintl/              # next-intl configuration
    │   ├── i18n-i18next/               # i18next configuration
    │   ├── nextjs-page/                # Next.js page with generateMetadata
    │   ├── react-view/                 # React view component pattern
    │   └── component/                  # Component + SCSS module + index
    └── settings.json                   # Hooks (auto-lint, pre-commit validation)
```

**Architecture:**
- **Agents** (`nextjs.md`, `react.md`) — concise core instructions loaded every session (~200 lines each)
- **Skills** — on-demand workflows loaded only when invoked (e.g., `/create-component`)
- **Subagents** — isolated specialists that run in their own context (SEO, theme, i18n, code review)
- **Knowledge** — deep reference files loaded on-demand via `@` imports
- **Examples** — working code templates the agent uses as patterns
- **Hooks** — automatic ESLint-fix-on-edit and pre-commit build validation

### Version Control Your Agent

Commit the `.claude/` directory so your entire team benefits:

```bash
git add .claude/
git commit -m "chore: add Frontend AI agent"
```

### Updating

Re-run the installer — it overwrites existing files with the latest version:

```bash
curl -fsSL https://raw.githubusercontent.com/workspace-studio/frontend-agent/main/install.sh | bash
```

---

## 4. Invoking the Agent

```bash
cd your-project
claude                    # Start Claude Code
# Type /agents → select "Next.js" or "React"
# Give it a task in natural language
```

The agent automatically:

- Detects your stack (Next.js or React+Vite)
- Reads relevant knowledge files based on your task
- References examples for correct patterns
- Implements the solution
- Runs build and lint validation
- Fixes any failures until green
- Updates your project's CLAUDE.md

### Skills (Slash Commands)

| Command | What it does | Stack |
|---------|-------------|-------|
| `/create-component Header — sticky nav with logo` | Create a component with SCSS module and index.ts | Both |
| `/create-view Settings — user preferences page` | Create view/page with routing and metadata | Both |
| `/add-store bookings — list, modals, loading` | Add Valtio store with actions and service | React |
| `/setup-i18n add-locale de` | Add new locale or translation keys | Both |
| `/setup-theme — primary=#1976d2, font=Inter` | Set up complete MUI theme (6 files) | Both |
| `/add-form ContactForm — name, email, message` | Add react-hook-form form with validation | Both |
| `/seo-audit` | Audit SEO: metadata, sitemaps, OG, structured data | Next.js |
| `/bootstrap-nextjs my-site — landing, en/hr` | Bootstrap new Next.js project from scratch | Next.js |
| `/bootstrap-react my-app — dashboard, en/hr` | Bootstrap new React+Vite project from scratch | React |
| `/fix-issue 42` | Read, analyze, fix a GitHub issue, create PR | Both |
| `/create-pr` | Create branch, commit, push, open PR | Both |
| `/refactor extract shared card component` | Refactor code safely while keeping build green | Both |

### Tips for Best Results

- **Use skills for common workflows.** `/create-component` is faster and more consistent than describing the steps manually.
- **Be specific.** Instead of "add a page", say "Create a 'Pricing' page with monthly/yearly toggle, 3 plan cards, FAQ section, generateMetadata with SEO, translations in en and hr."
- **Reference existing work.** "Follow the same pattern as the Header component" helps the agent stay consistent.
- **Mention the stack.** If you have both Next.js and React in the same repo, specify which one.
- **One task at a time.** The agent works best when focused on a single, well-defined task.

---

## 5. What the Agent Can Do

### Next.js Projects

| Capability | Description | Knowledge File |
|------------|-------------|----------------|
| Create pages | App Router pages with metadata, i18n, views pattern | `10-nextjs-app-router.md` |
| Create components | Server/client components with MUI, SCSS, translations | `03-component-patterns.md` |
| SEO optimization | Metadata, sitemaps, robots, JSON-LD, OG images | `13-seo-metadata.md` |
| i18n setup | next-intl routing, messages, locale-aware navigation | `08-i18n-nextintl.md` |
| MUI theming | Complete theme with colors, typography, overrides | `04-mui-theming.md` |
| Forms | react-hook-form with validation and translations | `07-forms-validation.md` |
| Performance | Image optimization, code splitting, Core Web Vitals | `14-performance.md` |
| Accessibility | ARIA, semantic HTML, keyboard navigation | `15-accessibility.md` |
| Code review | Pattern compliance, accessibility, performance audit | `01-code-style.md` |
| Bootstrap | New project from zero to running | `10-nextjs-app-router.md` |

### React+Vite Projects

| Capability | Description | Knowledge File |
|------------|-------------|----------------|
| Create views | Views with routing, lazy loading, access control | `11-react-vite-routing.md` |
| Create components | Components with MUI, SCSS modules, translations | `03-component-patterns.md` |
| State management | Valtio stores with actions, modal state, loading | `06-state-management.md` |
| API integration | Axios services with token refresh, error handling | `12-api-integration.md` |
| i18n setup | i18next with namespaces, 4+ locales | `09-i18n-i18next.md` |
| MUI theming | Complete theme with colors, typography, overrides | `04-mui-theming.md` |
| Forms | react-hook-form with Form/FormInput wrappers | `07-forms-validation.md` |
| PWA support | Service workers, offline mode, install prompt | `16-pwa-setup.md` |
| Code review | Pattern compliance, state management, performance | `01-code-style.md` |
| Bootstrap | New project from zero to running | `11-react-vite-routing.md` |

The agent reads only the knowledge files relevant to your task, keeping context efficient.

---

## 6. Example Tasks — Copy-Paste Ready

### Next.js: New Landing Page

```
Create a "Pricing" page at /pricing with:
- 3 plan cards (Basic, Pro, Enterprise) with features list
- Monthly/yearly toggle switch
- FAQ section with accordion
- generateMetadata with SEO title/description
- Translations in English and Croatian
- Responsive design (cards stack on mobile)
```

### Next.js: SEO Audit

```
Run a full SEO audit of this project. Check:
- Every page has generateMetadata
- Sitemap includes all routes
- robots.ts is configured correctly
- OG images exist and are correct size
- JSON-LD structured data is present
Fix any issues you find.
```

### Next.js: Add New Locale

```
Add German (de) locale to this project:
- Add 'de' to the locales array in routing.ts
- Create German message files for all namespaces
- Copy English translations as starting point
- Verify the build passes with the new locale
```

### React: New Feature Module

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

### React: Add Valtio Store

```
Create a Valtio store for "projects" with:
- State: projects list, selected project, total count, loading, modals (create, update, delete), form submitting
- Actions: getProjects, getProject, createProject, updateProject, deleteProject, toggleModals
- Service: ProjectsService with static CRUD methods
```

### Both: New Component

```
Create a "StatCard" component that shows:
- Icon (MUI icon passed as prop)
- Title (translated string)
- Value (number with formatting)
- Trend indicator (up/down arrow with percentage)
Use MUI Paper, Stack, Typography. SCSS module for custom styling.
Make it responsive (full width on mobile).
```

### Both: Setup MUI Theme

```
Set up a complete MUI theme with:
- Primary color: #2563EB (blue)
- Secondary color: #1E293B (dark slate)
- Font: Inter for body, Poppins for headings
- Border radius: 12px for cards, 8px for buttons
- Custom button styles (contained, outlined, text)
- Custom TextField with filled variant
- Custom Dialog styling
```

### Both: Code Review

```
Review the Header component and its sub-components for:
- Accessibility issues
- Performance problems
- Pattern compliance
- Styling consistency
Produce a structured review with critical issues, warnings, and suggestions.
```

---

## 7. Understanding the Project Structure

### Next.js Projects

```
src/
├── app/                               # App Router
│   ├── [locale]/                     # Dynamic locale segment
│   │   ├── layout.tsx                # Root layout (providers, metadata, JSON-LD)
│   │   ├── providers.tsx             # ThemeProvider, context providers
│   │   ├── (home)/                   # Route group: home layout
│   │   │   ├── layout.tsx            # Header + Footer
│   │   │   └── page.tsx              # Home page → imports from views/
│   │   ├── (public)/                 # Route group: public pages
│   │   │   ├── layout.tsx            # Shared public layout
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── blog/
│   │   │       ├── page.tsx
│   │   │       └── [slug]/page.tsx
│   │   └── (simple)/                 # Route group: minimal layout
│   │       └── layout.tsx
│   ├── api/                          # API routes
│   ├── robots.ts                     # robots.txt generation
│   └── sitemap.ts                    # Sitemap generation
│
├── components/                        # Reusable UI components
│   └── Header/
│       ├── Header.tsx                # 'use client' if interactive
│       ├── Header.module.scss        # Scoped styles
│       └── index.ts                  # Barrel export
│
├── views/                            # Page-level view components
│   └── Home/
│       ├── HeroSection/
│       │   ├── HeroSection.tsx
│       │   ├── HeroSection.module.scss
│       │   └── index.ts
│       └── FeaturesSection/
│
├── i18n/                             # Internationalization
│   ├── routing.ts                    # defineRouting({ locales, defaultLocale })
│   ├── request.ts                    # getRequestConfig with message imports
│   └── navigation.ts                # createNavigation (Link, redirect)
│
├── config/                           # Configuration
│   └── meta.config.ts               # Base metadata values
│
├── styles/
│   ├── index.scss                    # Global imports
│   ├── globals/                      # Reset, fonts, animations
│   ├── mixins/                       # Responsive breakpoints
│   ├── settings/                     # SCSS variables
│   ├── utils/                        # rem-calc helper
│   └── themes/                       # MUI theme (6 files)
│
├── types/                            # TypeScript definitions
└── utils/
    ├── hooks/                        # Custom hooks
    └── static/                       # Utility functions
```

### React+Vite Projects

```
src/
├── components/                        # Reusable UI components
│   └── Table/
│       ├── Table.tsx
│       ├── Table.module.scss
│       └── index.ts
│
├── views/                            # Page-level views
│   └── WorkOrders/
│       ├── WorkOrders.tsx
│       ├── WorkOrders.module.scss
│       ├── partials/                 # Sub-components
│       │   ├── CreateModal.tsx
│       │   └── DetailDrawer.tsx
│       └── index.ts
│
├── routers/
│   └── AppRouter.tsx                 # Routes with lazy loading + guards
│
├── valtio/                           # State management
│   └── workOrders/
│       ├── workOrders.store.ts       # proxy<Store>({...}) + useSnapshot
│       └── workOrders.actions.ts     # Async functions mutating store
│
├── services/                         # API layer
│   └── workOrders.service.ts         # Static class with axios calls
│
├── config/
│   ├── axios.config.ts               # Axios instance + interceptors
│   ├── constants.config.ts           # App constants
│   └── forms/
│       └── form-models.config.ts     # Form default values
│
├── i18n/
│   └── i18n.ts                       # i18next configuration
│
├── locales/                          # Translation files
│   ├── en/
│   │   ├── common.json
│   │   ├── navigation.json
│   │   └── work-orders.json
│   ├── hr/
│   ├── ba/
│   └── rs/
│
├── models/                           # Data model interfaces
├── @types/                           # Type augmentations
│
├── styles/
│   ├── index.scss
│   ├── globals/
│   ├── mixins/
│   ├── settings/
│   ├── utils/
│   └── themes/                       # MUI theme (6 files)
│
├── types/                            # TypeScript definitions
└── utils/
    ├── hooks/                        # Custom hooks
    └── context/                      # React context providers
```

### Layer Responsibilities

| Layer | Next.js | React+Vite |
|-------|---------|-----------|
| **Routing** | App Router + [locale] segments | React Router + AppRoute wrapper |
| **Pages** | `src/app/[locale]/page.tsx` (thin, imports views/) | `src/views/` (lazy loaded) |
| **State** | Server state (SSR) + Valtio (optional) | Valtio proxy + actions |
| **API** | Server Actions / fetch | Axios service classes |
| **i18n** | next-intl (URL-based) | i18next (localStorage) |
| **SEO** | generateMetadata, sitemap.ts, robots.ts | N/A (SPA) |
| **Styling** | MUI + SCSS Modules | MUI + SCSS Modules |

---

## 8. How It Works — Practical Flow

### Flow 1: Creating a Component (Next.js)

**You say:** `/create-component PricingCard — plan card with price, features list, CTA button`

**What the agent does:**

```
Step 1: Pre-Work (reads existing code)
├── Reads CLAUDE.md → learns project conventions
├── Reads package.json → Next.js 16, MUI v7, next-intl
├── Reads src/components/Header/ → learns component pattern
│   ├── Header.tsx uses 'use client', MUI AppBar, useTranslations
│   ├── Header.module.scss uses @use mixins, rem-calc()
│   └── index.ts exports default
└── Reads @knowledge/03-component-patterns.md → confirms pattern

Step 2: Reads knowledge files
├── @knowledge/03-component-patterns.md → folder structure, SCSS module, index.ts
└── @knowledge/05-scss-patterns.md → @use imports, rem-calc, media mixins

Step 3: Creates files
├── src/components/PricingCard/PricingCard.tsx
│   ├── Interface: PricingCardProps { planName, price, features, ctaText, highlighted }
│   ├── Uses: Paper, Stack, Typography, Button, List, ListItem from MUI
│   ├── Uses: useTranslations('pricing') for text
│   └── Uses: styles from './PricingCard.module.scss'
├── src/components/PricingCard/PricingCard.module.scss
│   ├── @use '@/styles/settings/variables' as *;
│   ├── @use '@/styles/utils/rem-calc' as *;
│   ├── @use '@/styles/mixins/breakpoints' as *;
│   └── .container, .highlighted, .price, .features classes
└── src/components/PricingCard/index.ts
    └── export { default } from './PricingCard';

Step 4: Adds translations
├── messages/en/pricing.json → { "card": { "perMonth": "/month", "getStarted": "Get Started" } }
└── messages/hr/pricing.json → { "card": { "perMonth": "/mjesečno", "getStarted": "Započni" } }

Step 5: Validation
├── yarn build → ✅ Pass
└── yarn lint → ✅ Pass

Step 6: Task Summary
═══════════════════════════════════════════
TASK SUMMARY
═══════════════════════════════════════════
Task:        Create PricingCard component
Files:       5 files created
Build:       Pass
Lint:        Pass
═══════════════════════════════════════════
```

---

### Flow 2: Creating a Complete Feature (React+Vite)

**You say:** "Create a complete Customers feature with list view, CRUD, modals, and translations"

**What the agent does:**

```
Step 1: Pre-Work
├── Reads CLAUDE.md → Valtio, i18next, Form+FormInput, ModalRoot
├── Reads existing feature (e.g., workOrders/) as reference
└── Reads @knowledge/06-state-management.md, @knowledge/07-forms-validation.md

Step 2: Creates Valtio Store
├── src/valtio/customers/customers.store.ts
│   └── proxy<CustomersStore>({ customers: [], selectedCustomer, totalCount, isLoading, modals... })
└── src/valtio/customers/customers.actions.ts
    └── getCustomers(), getCustomer(), createCustomer(), deleteCustomer(), toggleModals()

Step 3: Creates Service
└── src/services/customers.service.ts
    └── static getCustomers(params), getCustomer(id), createCustomer(payload), etc.

Step 4: Creates View
├── src/views/Customers/Customers.tsx → main view with table, search, modals
├── src/views/Customers/Customers.module.scss
├── src/views/Customers/partials/CreateCustomerModal.tsx
├── src/views/Customers/partials/DeleteCustomerModal.tsx
└── src/views/Customers/index.ts

Step 5: Adds Routing
└── src/routers/AppRouter.tsx
    └── Adds: <Route path="/customers/*" element={<AppRoute variant="protected" accessLevel={[ADMIN, USER]}><Customers /></AppRoute>} />

Step 6: Adds Translations (all 4 locales)
├── src/locales/en/customers.json
├── src/locales/hr/customers.json
├── src/locales/ba/customers.json
└── src/locales/rs/customers.json
    + Registers namespace in src/i18n/i18n.ts

Step 7: Validation
├── yarn build → ❌ Fail (missing import)
├── Fix → add lazy import to AppRouter
├── yarn build → ✅ Pass
└── yarn lint → ✅ Pass

Step 8: Updates CLAUDE.md
└── Adds customers to module list and folder structure
```

---

### Flow 3: SEO Audit (Next.js)

**You say:** `/seo-audit`

**What the agent does:**

```
Step 1: Scans all page.tsx files
├── src/app/[locale]/(home)/page.tsx → ✅ has generateMetadata
├── src/app/[locale]/(public)/about/page.tsx → ❌ MISSING generateMetadata
├── src/app/[locale]/(public)/blog/page.tsx → ✅ has generateMetadata
├── src/app/[locale]/(public)/blog/[slug]/page.tsx → ✅ has generateMetadata
└── src/app/[locale]/(public)/contact/page.tsx → ⚠️ has metadata but missing alternates

Step 2: Checks SEO infrastructure
├── src/app/robots.ts → ✅ present, disallows protected paths
├── src/app/sitemap.ts → ⚠️ missing /about route
├── Root layout → ✅ JSON-LD present
└── /public/meta/og-image.png → ✅ exists (1200x630)

Step 3: Produces Report

## SEO Audit Report

### Critical Issues
- [src/app/[locale]/(public)/about/page.tsx] Missing generateMetadata export — page has no SEO title/description

### Warnings
- [src/app/[locale]/(public)/contact/page.tsx:12] Missing alternates.languages — no hreflang tags for locale variants
- [src/app/sitemap.ts:15] About page URL not included in sitemap

### Suggestions
- [src/app/[locale]/(public)/blog/[slug]/page.tsx:8] Consider adding article structured data (JSON-LD) for blog posts

### Summary
1 critical, 2 warnings, 1 suggestion — fix the about page metadata first

Step 4: Fixes issues (if requested)
├── Adds generateMetadata to about/page.tsx
├── Adds alternates to contact/page.tsx
└── Adds /about to sitemap.ts
```

---

### Flow 4: Setting Up MUI Theme

**You say:** `/setup-theme — primary=#2563EB, font=Inter, border-radius=12`

**What the agent does:**

```
Step 1: Reads @knowledge/04-mui-theming.md and @examples/theme/

Step 2: Creates 6 files in src/styles/themes/

├── colors.ts
│   └── Color constants: blue50-950, gray50-950, green, red, yellow, white, black
│
├── breakpoints.ts
│   └── { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 }
│
├── palette.ts
│   └── primary: { main: colors.blue600 }, secondary, error, warning, success
│
├── typography.ts
│   └── fontFamily: 'Inter, sans-serif', h1-h3, body1-3, button variants
│
├── components.ts
│   └── MuiButton: { borderRadius: 12, variants... }
│   └── MuiTextField: { variant: 'filled', borderRadius: 12... }
│   └── MuiPaper: { borderRadius: 12... }
│   └── MuiDialog, MuiChip, MuiTab, MuiSwitch, etc.
│
└── index.ts
    └── export default createTheme({ breakpoints, components, palette, typography })

Step 3: Wires ThemeProvider
└── Updates providers.tsx or App.tsx with <ThemeProvider theme={theme}>

Step 4: yarn build → ✅ Pass
```

---

### Flow 5: Bootstrap New Project

**You say:** `/bootstrap-nextjs my-landing — marketing site for SaaS product, en and hr locales`

**What the agent does:**

```
Step 1: Creates Next.js project
└── npx create-next-app@latest my-landing --typescript --eslint --app --src-dir

Step 2: Installs dependencies
└── yarn add @mui/material @emotion/react @emotion/styled next-intl react-hook-form sass

Step 3: Sets up i18n
├── src/i18n/routing.ts → { locales: ['en', 'hr'], defaultLocale: 'en' }
├── src/i18n/request.ts → dynamic message imports
├── src/i18n/navigation.ts → createNavigation
├── src/middleware.ts → createMiddleware
├── messages/en/home.json, common.json, metadata.json
└── messages/hr/home.json, common.json, metadata.json

Step 4: Sets up MUI theme (6 files)

Step 5: Sets up SCSS structure
├── src/styles/index.scss
├── src/styles/globals/reset.scss
├── src/styles/mixins/breakpoints.scss
├── src/styles/settings/variables.scss
└── src/styles/utils/rem-calc.scss

Step 6: Creates root layout with providers, metadata, JSON-LD

Step 7: Creates home page
├── src/app/[locale]/(home)/layout.tsx → Header + Footer
├── src/app/[locale]/(home)/page.tsx → imports HeroSection
└── src/views/Home/HeroSection/

Step 8: Configures next.config.js with withNextIntl

Step 9: Sets up ESLint + Stylelint + Prettier

Step 10: Generates CLAUDE.md from template

Step 11: Validates
├── yarn build → ✅
└── yarn lint → ✅

Step 12: Commits
└── git commit on chore/bootstrap-project branch
```

---

### How Hooks Work (Automatic)

The install creates `.claude/settings.json` with hooks that run automatically:

```
You edit a .tsx file
  └── PostToolUse hook fires → npx eslint --fix automatically

You run git commit
  └── PreToolUse hook fires → yarn build && yarn lint must pass first
  └── If build fails → commit is blocked, agent fixes and retries
```

### How Knowledge Files Work (On-Demand)

```
Agent receives task: "Add a contact form"
  └── Agent reads @knowledge/07-forms-validation.md → learns Form+FormInput pattern
  └── Agent reads @knowledge/03-component-patterns.md → learns component structure
  └── Agent reads @examples/component/ → sees real code example
  └── Agent implements following the patterns
```

Knowledge files are NOT loaded every session — only when referenced via `@knowledge/` in the agent's instructions for that specific task type. This keeps context clean.

### How Subagents Work (Isolated Context)

```
You say: "Review the Header component for accessibility"
  └── Main agent delegates to code-reviewer subagent
  └── code-reviewer runs in SEPARATE context (doesn't pollute main)
  └── code-reviewer reads Header.tsx, checks accessibility checklist
  └── Returns structured review to main agent
  └── Main context stays clean for implementation
```

---

## 9. Troubleshooting

### Build fails with "Module not found"

```bash
# Check path aliases
cat tsconfig.json | grep paths    # Should have @/* mapping

# For Vite projects, also check vite.config.ts resolve.alias
```

### SCSS errors

```bash
# Check SCSS preprocessor config
# Vite: vite.config.ts → css.preprocessorOptions.scss.api should be 'modern'
# Next.js: next.config.js → sassOptions
```

### i18n: Translation key not found

```bash
# Check the namespace is registered
# Next.js: verify message file is imported in request.ts
# React: verify namespace is in i18n.ts ns array and JSON files exist in ALL locales
```

### MUI theme not applying

```bash
# Verify ThemeProvider wraps the app
# Next.js: check src/app/[locale]/providers.tsx
# React: check src/App.tsx or equivalent
```

### "use client" errors

```bash
# If you see "useState/useEffect can only be used in Client Components":
# Add 'use client' directive at the top of the file
# Only add it where needed — keep components server-side by default
```

### Valtio store not updating

```bash
# Ensure you're using useSnapshot() in components, not accessing proxy directly
# Ensure mutations happen in actions, not in components
```

### Agent not showing in /agents

```bash
ls .claude/agents/               # Should contain nextjs.md and react.md
# If missing, re-run the installer
```

### Port already in use

```bash
lsof -i :3000       # Find process using port
kill <PID>           # Kill it
```

---

## 10. Architecture Reference

### How the Agent System Works

```
┌─────────────────────────────────────────────────────┐
│                    Claude Code                       │
│                                                     │
│  ┌─────────────┐    ┌──────────────┐               │
│  │  nextjs.md   │    │   react.md   │  Main Agents  │
│  │  (Next.js)   │    │  (React)     │  (loaded per  │
│  └──────┬───────┘    └──────┬───────┘   session)    │
│         │                   │                       │
│  ┌──────┴───────────────────┴──────┐                │
│  │         Subagents               │                │
│  │  component-creator              │  (isolated     │
│  │  seo-specialist                 │   context)     │
│  │  theme-implementor              │                │
│  │  i18n-specialist                │                │
│  │  code-reviewer                  │                │
│  └──────┬───────────────────┬──────┘                │
│         │                   │                       │
│  ┌──────┴──────┐    ┌───────┴──────┐                │
│  │   Skills    │    │  Knowledge   │  (loaded       │
│  │ /create-*   │    │  01-18.md    │   on-demand)   │
│  │ /setup-*    │    │              │                │
│  │ /bootstrap  │    │  Examples    │                │
│  │ /fix-issue  │    │  valtio/     │                │
│  │ /create-pr  │    │  theme/      │                │
│  │ /refactor   │    │  i18n/       │                │
│  └─────────────┘    └──────────────┘                │
└─────────────────────────────────────────────────────┘
```

### Knowledge Files

| # | File | Description |
|---|------|-------------|
| 01 | `code-style.md` | ESLint, Prettier, Stylelint, naming conventions |
| 02 | `project-structure.md` | Next.js vs React folder layouts |
| 03 | `component-patterns.md` | Component structure, SCSS modules, barrels |
| 04 | `mui-theming.md` | MUI theme: colors, palette, typography, overrides |
| 05 | `scss-patterns.md` | SCSS modules, mixins, rem-calc, variables |
| 06 | `state-management.md` | Valtio proxy + actions pattern |
| 07 | `forms-validation.md` | react-hook-form patterns |
| 08 | `i18n-nextintl.md` | next-intl setup for Next.js |
| 09 | `i18n-i18next.md` | i18next setup for React+Vite |
| 10 | `nextjs-app-router.md` | App Router: layouts, pages, metadata, route groups |
| 11 | `react-vite-routing.md` | React Router, lazy loading, guards |
| 12 | `api-integration.md` | Axios config, services, server actions |
| 13 | `seo-metadata.md` | Metadata API, sitemaps, structured data, OG |
| 14 | `performance.md` | Image optimization, code splitting |
| 15 | `accessibility.md` | ARIA, semantic HTML, keyboard navigation |
| 16 | `pwa-setup.md` | Service workers, offline mode |
| 17 | `git-and-pr-workflow.md` | Git branching, commit conventions |
| 18 | `testing-patterns.md` | Vitest/Jest, React Testing Library |

The agent reads only the files relevant to the current task, keeping context usage efficient.

### Example Implementations

- **`valtio-store/`** — Complete Valtio store with proxy, useSnapshot, and async CRUD actions
- **`service/`** — Axios service class with static methods and error handling
- **`theme/`** — Full MUI theme (6 files: colors, breakpoints, palette, typography, components, index)
- **`i18n-nextintl/`** — next-intl routing and request configuration
- **`i18n-i18next/`** — i18next config with LanguageDetector
- **`nextjs-page/`** — Next.js page with generateMetadata and view import
- **`react-view/`** — React view component with list pattern
- **`component/`** — Component with SCSS module and barrel export

---

Built by [Workspace Studio](https://github.com/workspace-studio)
