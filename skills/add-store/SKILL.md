---
name: add-store
description: Add a state store with actions — Zustand for Next.js, Valtio for React+Vite
---

# Add Store

Add a state store with actions. Usage: `/add-store domain — state fields description`

Auto-detects stack from package.json:
- **Next.js** → Zustand (`src/stores/`)
- **React+Vite** → Valtio (`src/valtio/`)

## Pre-Work

1. Detect stack from package.json (`next` → Zustand, no `next` → Valtio)
2. READ the relevant knowledge file:
   - Next.js: @knowledge/23-zustand.md + @examples/zustand-store/
   - React: @knowledge/06-state-management.md + @examples/valtio-store/
3. READ @examples/service/ for service class pattern (React only)
4. READ existing stores for project-specific patterns

**Special case — `global` store:** Use the standard global store pattern from examples. Includes toast notifications. Also create the Toast component and SVG icons.

## Steps — Next.js (Zustand)

### Step 1: Create Store

Create `src/stores/{domain}.store.ts`:
- State interface with actions co-located
- `create<T>(set => ({...}))` for simple stores
- `create<T>()(persist(...))` for stores needing session persistence
- For persisted stores: `skipHydration: true`, `partialize`, `_hydrated` flag, sessionStorage try/catch

### Step 2: Use with Selectors

Every consumer MUST use selectors:
- 1-3 props: `useStore(s => s.field)`
- 4+ props: `useStore(useShallow(s => ({...})))`
- NEVER `useStore()` without selector

### Step 3: Validate

```bash
yarn build && yarn lint
```

## Steps — React+Vite (Valtio)

### Step 1: Create Store

Create `src/valtio/{domain}/{domain}.store.ts` with `proxy<T>({...})` + `useSnapshot`.

### Step 2: Create Actions

Create `src/valtio/{domain}/{domain}.actions.ts` — async CRUD, modal toggles, loading state.

### Step 3: Create Service (if needed)

Create `src/services/{domain}.service.ts` — static class with axios calls.

### Step 4: Validate

```bash
yarn build && yarn lint
```
