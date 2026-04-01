# State Management — Valtio (React+Vite)

Valtio is for **React+Vite SPA projects** (no server-side rendering). For Next.js SSR projects, use Zustand — see @knowledge/23-zustand.md.

## Overview

Valtio uses JavaScript Proxy for reactive state. Pattern: `.store.ts` + `.actions.ts` per domain in `src/valtio/`.

## Store Pattern

```typescript
// src/valtio/workOrders/workOrders.store.ts
import { proxy, useSnapshot } from 'valtio';

import { WorkOrderModel, WorkOrderShortInfo } from '@/models/work-order.model';

interface WorkOrdersStore {
  workOrders: WorkOrderShortInfo[];
  selectedWorkOrder?: WorkOrderModel;
  selectedRows: string[];
  totalCount: number;
  isLoading: boolean;
  createWorkOrderModalOpen: boolean;
  updateWorkOrderModalOpen: boolean;
  deleteWorkOrderModalOpen: boolean;
  isFormSubmitting: boolean;
}

export const workOrdersStore = proxy<WorkOrdersStore>({
  workOrders: [],
  selectedWorkOrder: undefined,
  selectedRows: [],
  totalCount: 0,
  isLoading: false,
  createWorkOrderModalOpen: false,
  updateWorkOrderModalOpen: false,
  deleteWorkOrderModalOpen: false,
  isFormSubmitting: false,
});

export const useWorkOrdersStore = (): WorkOrdersStore => useSnapshot(workOrdersStore);
```

### Store Structure

Every store has:
- **Entity list** — `items: Model[]`
- **Selected entity** — `selectedItem?: Model`
- **Pagination** — `totalCount: number`
- **Loading** — `isLoading: boolean`
- **Modal flags** — `createModalOpen`, `updateModalOpen`, `deleteModalOpen`
- **Form state** — `isFormSubmitting: boolean`

## Actions Pattern

```typescript
// src/valtio/workOrders/workOrders.actions.ts
import WorkOrdersService from '@/services/workOrders.service';
import { WorkOrdersParams } from '@/services/workOrders.service';
import { PayloadResponse } from '@/types/response.type';

import { workOrdersStore } from './workOrders.store';

export async function getWorkOrders(params: WorkOrdersParams): Promise<void> {
  workOrdersStore.isLoading = true;
  const { entities, totalCount } = await WorkOrdersService.getWorkOrders(params);
  workOrdersStore.isLoading = false;
  workOrdersStore.workOrders = entities;
  workOrdersStore.totalCount = totalCount;
}

export function clearSelectedWorkOrder(): void {
  workOrdersStore.selectedWorkOrder = undefined;
}

export function toggleCreateWorkOrderModal(isOpen?: boolean | React.MouseEvent): void {
  workOrdersStore.createWorkOrderModalOpen =
    typeof isOpen === 'boolean' ? isOpen : !workOrdersStore.createWorkOrderModalOpen;
}
```

## Usage in Components

```tsx
import { useWorkOrdersStore } from '@/valtio/workOrders/workOrders.store';
import { getWorkOrders, toggleCreateWorkOrderModal } from '@/valtio/workOrders/workOrders.actions';

const WorkOrdersList = () => {
  const { workOrders, totalCount, isLoading } = useWorkOrdersStore();

  const handleCreate = () => toggleCreateWorkOrderModal(true);

  return (
    // render UI
  );
};
```

## Global Store (ALWAYS created)

Every React+Vite project MUST have a `global` store with toast and form dirty state. See @examples/valtio-store/global.* for reference implementation.

Toast component pattern: MUI `Snackbar` + `Alert` with custom SVG icons per severity. Place `<Toast />` in root providers.

## Rules

- **NEVER** use Redux or Context API for global state
- **NEVER** add `'use client'` to `.store.ts` or `.actions.ts` files
- **NEVER** mutate store directly from components — only through actions
- **Always** use `useSnapshot()` for reactive reads in components
- **Always** separate store and actions into two files
- **Always** create global store with toast + isFormDirty on project setup
- Store owns: entity lists, selected entity, loading states, modal flags, form submission state
- Actions call services and update store
