---
name: add-store
description: Add a Valtio store with actions and optional service for a domain
---

# Add Valtio Store

Add a Valtio store with actions and service. Usage: `/add-store domain — state fields description`

## Pre-Work

1. READ @knowledge/06-state-management.md for Valtio patterns
2. READ @examples/valtio-store/ for reference implementation
3. READ @examples/service/ for service class pattern
4. READ existing stores from `src/valtio/` for project-specific patterns

## Steps

### Step 1: Create Store

Create `src/valtio/{domain}/{domain}.store.ts`:

```typescript
import { proxy, useSnapshot } from 'valtio';
import type { DomainModel } from '@/models/domain.model';

interface DomainStore {
  items: DomainModel[];
  selectedItem?: DomainModel;
  totalCount: number;
  isLoading: boolean;
  createModalOpen: boolean;
  updateModalOpen: boolean;
  deleteModalOpen: boolean;
  isFormSubmitting: boolean;
}

export const domainStore = proxy<DomainStore>({
  items: [],
  selectedItem: undefined,
  totalCount: 0,
  isLoading: false,
  createModalOpen: false,
  updateModalOpen: false,
  deleteModalOpen: false,
  isFormSubmitting: false,
});

export const useDomainStore = (): DomainStore => useSnapshot(domainStore);
```

### Step 2: Create Actions

Create `src/valtio/{domain}/{domain}.actions.ts`:

- Async CRUD functions (getAll, getOne, create, update, delete)
- Modal toggle functions
- Loading/submitting state management
- Import and mutate store directly
- Call service methods for API operations

### Step 3: Create Service (if needed)

Create `src/services/{domain}.service.ts`:

- Static class with `public static async` methods
- Use `api` from `@/config/axios.config`
- Use `createQueryParams` for query parameters
- Return `PaginatedResponse<T>` for lists, `PayloadResponse<T>` for mutations
- Try/catch with fallback returns

### Step 4: Validate

```bash
yarn build && yarn lint
```
