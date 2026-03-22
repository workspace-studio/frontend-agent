---
name: create-view
description: Create a new view/page with routing, metadata (Next.js), and translations
---

# Create View

Create a new view/page with proper routing. Usage: `/create-view ViewName — description`

## Pre-Work

1. READ the project's CLAUDE.md
2. READ @knowledge/10-nextjs-app-router.md (Next.js) or @knowledge/11-react-vite-routing.md (React)
3. READ existing views from `src/views/` for patterns
4. Detect stack from package.json

## Steps — Next.js

### Step 1: Create View Component

```
src/views/ViewName/
├── ViewName.tsx
├── ViewName.module.scss  # Only if needed
└── index.ts
```

### Step 2: Create Page

```
src/app/[locale]/(group)/view-name/page.tsx
```

Page must export `generateMetadata()`:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.metadata.viewName');
  return buildMetadata({ title: t('title'), description: t('description'), path: t('path') });
}

const ViewNamePage = () => <ViewName />;
export default ViewNamePage;
```

### Step 3: Add Translations

Add to ALL locales in `messages/{locale}/`.

### Step 4: Update Sitemap

Add new route to `sitemap.ts` if it's a public page.

### Step 5: Validate

```bash
yarn build && yarn lint
```

## Steps — React+Vite

### Step 1: Create View Component

```
src/views/ViewName/
├── ViewName.tsx
├── ViewName.module.scss  # Only if needed
├── partials/             # Sub-components (modals, drawers)
└── index.ts
```

### Step 2: Add Lazy Import to AppRouter

```typescript
const ViewName = lazy(() => import('@/views/ViewName'));
```

### Step 3: Add Route

```tsx
<Route path="/view-name/*" element={
  <AppRoute variant="protected" accessLevel={[UserRoleName.ADMIN, UserRoleName.USER]}>
    <ViewName />
  </AppRoute>
} />
```

### Step 4: Add Translations

Add to ALL locales in `src/locales/{locale}/`.

### Step 5: Add Navigation Entry

Update navigation config if the view needs a sidebar/menu entry.

### Step 6: Validate

```bash
yarn build && yarn lint
```
