# State Management — Valtio

## Overview

We use **Valtio** for state management. NEVER use Redux or Context API for global state.

Valtio uses JavaScript Proxy for reactive state. Pattern: `.store.ts` + `.actions.ts` per domain in `src/valtio/`.

## Store Pattern

```typescript
// src/valtio/workOrders/workOrders.store.ts
import { proxy, useSnapshot } from 'valtio';

import type { WorkOrderModel, WorkOrderShortInfo } from '@/models/work-order.model';

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
import type { WorkOrdersParams } from '@/services/workOrders.service';
import type { PayloadResponse } from '@/types/response.type';

import { workOrdersStore } from './workOrders.store';

// GET LIST — set loading, call service, update store
export async function getWorkOrders(params: WorkOrdersParams): Promise<void> {
  workOrdersStore.isLoading = true;

  const { entities, totalCount } = await WorkOrdersService.getWorkOrders(params);

  workOrdersStore.isLoading = false;
  workOrdersStore.workOrders = entities;
  workOrdersStore.totalCount = totalCount;
}

// GET SINGLE — call service, set selected
export async function getSelectedWorkOrder(id: number): Promise<void> {
  const response = await WorkOrdersService.getWorkOrder(id);
  workOrdersStore.selectedWorkOrder = response!;
}

// CLEAR SELECTED
export function clearSelectedWorkOrder(): void {
  workOrdersStore.selectedWorkOrder = undefined;
}

// CREATE — set submitting, call service, reset submitting
export async function createWorkOrder(payload: CreateFormValues): Promise<PayloadResponse<boolean>> {
  workOrdersStore.isFormSubmitting = true;
  const response = await WorkOrdersService.createWorkOrder(payload);
  workOrdersStore.isFormSubmitting = false;
  return response;
}

// MODAL TOGGLE
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

  // Call actions directly — NEVER mutate store from components
  const handleCreate = () => toggleCreateWorkOrderModal(true);

  return (
    // render UI
  );
};
```

## Rules

- **NEVER** use Redux or Context API for global state
- **NEVER** mutate store directly from components — only through actions
- **Always** use `useSnapshot()` for reactive reads in components
- **Always** separate store and actions into two files
- Store owns: entity lists, selected entity, loading states, modal flags, form submission state
- Actions call services and update store
