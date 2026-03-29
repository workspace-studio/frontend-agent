# API Integration

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

```typescript
// src/actions/contact.actions.ts
'use server';

export async function submitContactForm(data: ContactFormData) {
  const response = await fetch(`${process.env.API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to submit');

  revalidatePath('/contact');
  return { success: true };
}
```

### Server Action Rules

- **Always check `response.ok`** before parsing — error pages should not be treated as valid data
- **Use `cache: 'no-store'`** for per-request data that should not be cached between requests (e.g., geo-detection, user-specific data)
- **Geo-detection**: use platform headers (`x-vercel-ip-country`, `cf-ipcountry`) from the request via `headers()` — NEVER fetch a geo-IP API from the server (returns the server/data center location, not the user's)
- **NEVER `console.log`** in server actions — especially not tokens, codes, passwords, or user data
- **Client-side calls to server actions** must always handle errors: `.then().catch()` or try/catch. Without `.catch()`, a failed server action silently rejects and the UI hangs on a loading spinner forever
