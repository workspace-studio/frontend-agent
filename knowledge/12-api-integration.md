# API Integration

## Pre-Work: Check openapi.json

**BEFORE creating any API types, models, or server actions**, check if `openapi.json` exists in the project root. If it does, READ it to understand:
- Exact endpoint paths and HTTP methods
- Request/response schemas and field names
- Required vs optional fields
- Enum values and status codes

NEVER invent API fields, endpoints, or methods. Use what the spec defines.

### WARNING: Local openapi.json can be stale

If a backend repo exists in the workspace (e.g. `../znjan-ws/`, `../*-ws`, `../backend`), READ the backend DTOs + Prisma schema INSTEAD of relying solely on the frontend's local `openapi.json`. Local copies can be out of sync after backend changes — this has caused runtime enum validation errors in past PRs.

Backend DTOs with class-validator decorators (`@IsEnum`, `@ApiProperty`, `@IsOptional`) are the authoritative source for field names, enum values, and required/optional flags.

See `@knowledge/24-api-alignment.md` for the full cross-repo alignment workflow.

## Axios Configuration (React+Vite)

```typescript
// src/config/axios.config.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface TokenData {
  token: string;
  refreshToken: string;
  userId: number;
}

const getTokenData = (): TokenData | null => {
  const tokenString = localStorage.getItem('auth_token');
  if (!tokenString) return null;
  try { return JSON.parse(tokenString); } catch { return null; }
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_WS_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokenData = getTokenData();
  if (tokenData?.token) {
    config.headers.Authorization = `Bearer ${tokenData.token}`;
  }
  return config;
});

// Response interceptor — handle 403 with token refresh queue
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 403 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokenData = getTokenData();
        const response = await axios.post(`${import.meta.env.VITE_WS_API_URL}/auth/refreshToken`, {}, {
          headers: { Authorization: `Bearer ${tokenData?.refreshToken}` },
        });
        // Save new tokens, process queue, retry
        return api(originalRequest);
      } catch {
        // Clear tokens, redirect to login
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error.response?.data);
  }
);
```

## Service Class Pattern

```typescript
// src/services/equipment.service.ts
import { api } from '@/config/axios.config';
import{ EquipmentModel } from '@/models/equipment.model';
import{ ErrorModel } from '@/models/error.model';
import{ PaginatedResponse, PayloadResponse } from '@/types/response.type';
import { createQueryParams } from '@/utils/static/queryParams';

export default class EquipmentService {
  public static async getAll(params: EquipmentParams): Promise<PaginatedResponse<EquipmentModel>> {
    try {
      const queryParams = createQueryParams(params);
      const { data } = await api.get(`/equipment${queryParams}`);
      return data;
    } catch {
      return { entities: [], totalCount: 0 };
    }
  }

  public static async getById(id: number): Promise<EquipmentModel | null> {
    try {
      const { data } = await api.get(`/equipment/${id}`);
      return data || null;
    } catch {
      return null;
    }
  }

  public static async create(payload: CreateFormValues): Promise<PayloadResponse<boolean>> {
    try {
      await api.put('/equipment', payload);
      return { payload: true };
    } catch (error) {
      const { message } = error as ErrorModel;
      return { payload: false, message };
    }
  }
}
```

## Response Types

```typescript
// src/types/response.type.ts
export type PaginatedResponse<T> = {
  entities: T[];
  totalCount: number;
};

export type PayloadResponse<T> = {
  payload: T;
  message?: string;
};
```

## Next.js — Server Actions

### Response Type

Use one generic `ActionResponse<T>` for all server actions — NEVER create per-action interfaces (`LoginResult`, `RegisterResult`, etc.):

```typescript
// src/types/response.type.ts
type ActionResponse<T = Record<string, unknown>> = {
  success: boolean;
  message?: string;
  data?: T;
};

export default ActionResponse;
```

### Server Action Pattern

Typed params, try/catch, `cache: 'no-store'` on auth/validation endpoints:

```typescript
// src/actions/auth.actions.ts
'use server';

import ActionResponse from '@/types/response.type';

export const login = async (email: string, password: string): Promise<ActionResponse> => {
  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return { success: false, message: error?.message || 'Login failed' };
    }

    const data = await response.json();
    // set cookies, revalidate, etc.
    return { success: true };
  } catch {
    return { success: false, message: 'An unexpected error occurred' };
  }
};
```

### View Form Handler Pattern

Use `useTransition` + direct `await` — NEVER `useActionState` + `useEffect` + `FormData`:

```tsx
// View component
const [isPending, startTransition] = useTransition();

const handleSubmit = (data: LoginFormValues) => {
  startTransition(async () => {
    const result = await login(data.email, data.password);

    if (result.success) {
      router.push('/');
    } else {
      showToast({ status: 'error', text: result.message || t('loginFailed') });
    }
  });
};
```

**Why `useTransition`:**
- Auto-manages `isPending` — no manual `setLoading(true/false)`, no cleanup risk
- Server actions are called directly with typed params — no `FormData` conversion
- Result is handled immediately — no `useEffect` watching state changes

### Server Action Rules

- **Typed params** — `login(email, password)` not `login(_state, formData)`. FormData is for progressive enhancement; typed params are cleaner
- **Always check `response.ok`** — error pages should not be treated as valid data
- **`cache: 'no-store'`** on ALL auth/validation fetches — not just some. Be consistent
- **Guard `process.env`** — missing env vars should return gracefully: `if (!process.env.API_URL) return { success: false, message: '...' }`
- **Geo-detection**: use platform headers (`x-vercel-ip-country`) — NEVER fetch geo-IP API from server
- **NEVER `console.log`** in server actions — especially not tokens, codes, passwords
- **One `ActionResponse<T>`** for all actions — never create `LoginResult`, `RegisterResult`, etc.
- **NEVER use `useActionState` + `useEffect`** — use `useTransition` + direct `await` instead
- **NEVER use `useState` for loading** when calling server actions — `useTransition` gives you `isPending` for free
- **Sensitive params as object** — `login({ email, password })` not `login(email, password)`. Next.js dev server logs separate string args in terminal — object params log as `{...}`
- **Never return hardcoded user-facing strings** — return `{ success: false }` and let client use translated fallback like `t('loginFailed')`
- **Always type `JSON.parse()` and `response.json()`** return values explicitly — never leave as implicit `any`
