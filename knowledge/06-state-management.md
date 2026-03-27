# State Management — Valtio

## Overview

We use **Valtio** for state management. NEVER use Redux or Context API for global state.

Valtio uses JavaScript Proxy for reactive state. Pattern: `.store.ts` + `.actions.ts` per domain in `src/valtio/`.

## Store Pattern

```typescript
// src/valtio/workOrders/workOrders.store.ts
import { proxy, useSnapshot } from "valtio";

import {
  WorkOrderModel,
  WorkOrderShortInfo,
} from "@/models/work-order.model";

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

export const useWorkOrdersStore = (): WorkOrdersStore =>
  useSnapshot(workOrdersStore);
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
import WorkOrdersService from "@/services/workOrders.service";
import { WorkOrdersParams } from "@/services/workOrders.service";
import { PayloadResponse } from "@/types/response.type";

import { workOrdersStore } from "./workOrders.store";

// GET LIST — set loading, call service, update store
export async function getWorkOrders(params: WorkOrdersParams): Promise<void> {
  workOrdersStore.isLoading = true;

  const { entities, totalCount } =
    await WorkOrdersService.getWorkOrders(params);

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
export async function createWorkOrder(
  payload: CreateFormValues
): Promise<PayloadResponse<boolean>> {
  workOrdersStore.isFormSubmitting = true;
  const response = await WorkOrdersService.createWorkOrder(payload);
  workOrdersStore.isFormSubmitting = false;
  return response;
}

// MODAL TOGGLE
export function toggleCreateWorkOrderModal(
  isOpen?: boolean | React.MouseEvent
): void {
  workOrdersStore.createWorkOrderModalOpen =
    typeof isOpen === "boolean"
      ? isOpen
      : !workOrdersStore.createWorkOrderModalOpen;
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

## Global Store (ALWAYS created)

Every project MUST have a `global` store with toast notifications and form dirty state. This is identical across all projects.

### global.store.ts

```typescript
// src/valtio/global/global.store.ts
import { proxy, useSnapshot } from "valtio";

import Toast from "@/types/toast.type";

interface GlobalStore {
  toast?: Toast;
  isFormDirty: boolean;
}

export const globalStore = proxy<GlobalStore>({
  toast: undefined,
  isFormDirty: false,
});

export const useGlobalStore = (): GlobalStore => useSnapshot(globalStore);
```

### global.actions.ts

```typescript
// src/valtio/global/global.actions.ts
import Toast from "@/types/toast.type";

import { globalStore } from "./global.store";

export const showToast = ({ status, text }: Toast): void => {
  globalStore.toast = {
    text,
    status,
  };
};

export const resetToast = (): void => {
  globalStore.toast = undefined;
};

export function setIsFormDirty(isDirty: boolean): void {
  globalStore.isFormDirty = isDirty;
}
```

### Toast type

```typescript
// src/types/toast.type.ts
type Toast = {
  status: "success" | "error" | "warning" | "info";
  text: string;
};

export default Toast;
```

### Toast Component

The Toast component uses MUI `Snackbar` + `Alert` with custom SVG icons per severity. Style it via Figma design.

```tsx
// src/components/Toast/Toast.tsx
import React, { useEffect } from "react";

import { Alert, Snackbar } from "@mui/material";

import Error from "@/components/SvgIcons/Toast/Error";
import Info from "@/components/SvgIcons/Toast/Info";
import Success from "@/components/SvgIcons/Toast/Success";
import Warning from "@/components/SvgIcons/Toast/Warning";
import { resetToast } from "@/valtio/global/global.actions";
import { useGlobalStore } from "@/valtio/global/global.store";

const Toast: React.FC = () => {
  const { toast } = useGlobalStore();

  useEffect(() => {
    if (toast) {
      setTimeout(() => {
        resetToast();
      }, 3000);
    }
  }, [toast]);

  if (!toast) {
    return null;
  }

  const customIconMapping = {
    success: <Success size={24} />,
    error: <Error />,
    warning: <Warning />,
    info: <Info />,
  };

  return (
    <Snackbar open={Boolean(toast)} onClose={resetToast}>
      <Alert severity={toast?.status} iconMapping={customIconMapping}>
        {toast?.text}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
```

**Setup:**

- Create `src/components/SvgIcons/Toast/` with Success, Error, Warning, Info icons (follow SVG icon rules)
- Place `<Toast />` in the root layout/providers so it's always rendered
- Style the Snackbar/Alert via Figma design — the user will send the design

## Rules

- **NEVER** use Redux or Context API for global state
- **NEVER** add `'use client'` to `.store.ts` or `.actions.ts` files — they are not React components
- **NEVER** mutate store directly from components — only through actions
- **Always** use `useSnapshot()` for reactive reads in components
- **Always** separate store and actions into two files
- **Always** create global store with toast + isFormDirty on project setup
- Store owns: entity lists, selected entity, loading states, modal flags, form submission state
- Actions call services and update store
