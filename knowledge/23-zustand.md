# State Management — Zustand (Next.js)

Zustand is for **Next.js SSR projects**. It supports `persist` middleware with `skipHydration` for SSR-safe session persistence. For React+Vite SPA projects, use Valtio — see @knowledge/06-state-management.md.

## Store Pattern

Actions co-located with state in same file. Stores live in `src/stores/`.

### Simple store (no persistence)

```typescript
// src/stores/global.store.ts
import { create } from 'zustand';

import Toast from '@/types/toast.type';

interface GlobalState {
  toast?: Toast;
  showToast: (toast: Toast) => void;
  resetToast: () => void;
}

const useGlobalStore = create<GlobalState>(set => ({
  toast: undefined,
  showToast: toast => set({ toast }),
  resetToast: () => set({ toast: undefined }),
}));

export default useGlobalStore;
```

### Persisted store (sessionStorage + SSR-safe)

```typescript
// src/stores/reserve.store.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReserveState {
  _hydrated: boolean;
  currentStep: number;
  selectedCourtId: string | null;
  // ... state fields
  nextStep: () => void;
  resetSteps: () => void;
  // ... action fields
}

const useReserveStore = create<ReserveState>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      currentStep: 0,
      selectedCourtId: null,
      // ... defaults

      nextStep: () => {
        const { currentStep } = get();
        set({ currentStep: currentStep + 1 });
      },
      resetSteps: () => set({
        currentStep: 0,
        selectedCourtId: null,
        // ... reset all navigation fields
      }),
    }),
    {
      name: 'reserve-store',
      storage: createJSONStorage(() => {
        try {
          return sessionStorage;
        } catch {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
      }),
      skipHydration: true,
      partialize: state => ({
        currentStep: state.currentStep,
        selectedCourtId: state.selectedCourtId,
        // ONLY navigation state — never persist errors, status, doorCode
      }),
      onRehydrateStorage: () => () => {
        useReserveStore.setState({ _hydrated: true });
      },
    }
  )
);

export default useReserveStore;
```

## Selectors — MANDATORY

Zustand does NOT auto-track like Valtio. Every store call MUST use a selector:

```typescript
// 1-3 properties → individual selectors
const showToast = useGlobalStore(s => s.showToast);
const cancellationId = useReservationStore(s => s.cancellationId);

// 4+ properties → useShallow
import { useShallow } from 'zustand/react/shallow';

const { currentStep, selectedCourtId, selectedDate, selectedSlot } = useReserveStore(
  useShallow(s => ({
    currentStep: s.currentStep,
    selectedCourtId: s.selectedCourtId,
    selectedDate: s.selectedDate,
    selectedSlot: s.selectedSlot,
  }))
);

// ❌ NEVER — subscribes to entire store, causes re-renders on ANY change
const { showToast } = useGlobalStore();
```

## Hydration (persisted stores only)

With `skipHydration: true`, components render with default state before `rehydrate()` completes. Gate rendering on `_hydrated`:

```tsx
const ReserveSteps = () => {
  const _hydrated = useReserveStore(s => s._hydrated);

  useEffect(() => {
    useReserveStore.persist.rehydrate();
  }, []);

  if (!_hydrated) return null; // Prevents flash of default state

  return <StepContent />;
};
```

## State Lifecycle

### Multi-step flow reset

Reset store on component UNMOUNT — not reactively on state change:

```tsx
useEffect(() => {
  return () => {
    useReserveStore.getState().resetSteps();
  };
}, []);
```

**Why unmount, not reactive:** A reactive `useEffect` watching `bookingStatus` would fire when booking succeeds → reset immediately → user never sees success screen.

### Mount effects — check existing state

```typescript
// ❌ BAD: Always clears slot, even when returning from step 2
useEffect(() => {
  selectDate(selectedDate || today);
}, []);

// ✅ CORRECT: Only initialize if no date selected
useEffect(() => {
  if (!selectedDate) selectDate(today);
}, []);
```

## Global Store (ALWAYS created)

Every Next.js project MUST have a `global` store with toast. See @examples/zustand-store/global.store.ts.

Toast component is identical to Valtio version — just import from `@/stores/global.store` instead of `@/valtio/global/`.

## Rules

- **NEVER** use Valtio in Next.js projects — use Zustand (Valtio has no SSR hydration story)
- **NEVER** call `useStore()` without a selector — every call needs `(s => s.field)` or `useShallow`
- **NEVER** manually call `sessionStorage.removeItem()` — let Zustand persist handle it via store mutations
- **NEVER** react to state changes to reset state — use unmount cleanup instead
- **NEVER** call state-clearing actions unconditionally on mount — check if state exists first
- **NEVER** create wrapper components for single-use side effects — inline the logic where needed
- **Always** wrap `sessionStorage`/`localStorage` in try/catch with no-op fallback
- **Always** add `_hydrated: boolean` to persisted stores and check it before rendering
- **Always** use `partialize` — only persist navigation state, never UI state (errors, status)
- `useShallow` threshold: 4+ properties. Below that, individual selectors
- Stores live in `src/stores/` (NOT `src/valtio/`)
- Actions co-located with state in same file (NOT separate `.actions.ts`)
