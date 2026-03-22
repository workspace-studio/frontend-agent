# React Router + Vite

## AppRouter Pattern

```tsx
// src/routers/AppRouter.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppRoute from '@/components/AppRoute';
import Loader from '@/components/Loader';
import { UserRoleName } from '@/models/user.model';

// Lazy load ALL views
const Login = lazy(() => import('@/views/Login'));
const ForgotPassword = lazy(() => import('@/views/ForgotPassword'));
const Dashboard = lazy(() => import('@/views/Dashboard'));
const Customers = lazy(() => import('@/views/Customers'));
const Settings = lazy(() => import('@/views/Settings'));

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Anonymous routes */}
        <Route path="/login" element={<AppRoute variant="anonymous"><Login /></AppRoute>} />
        <Route path="/forgot-password" element={<AppRoute variant="anonymous"><ForgotPassword /></AppRoute>} />

        {/* Protected routes */}
        <Route path="/*" element={
          <AppRoute variant="protected" accessLevel={[UserRoleName.ADMIN, UserRoleName.USER]}>
            <Dashboard />
          </AppRoute>
        } />
        <Route path="/customers/*" element={
          <AppRoute variant="protected" accessLevel={[UserRoleName.ADMIN, UserRoleName.USER]}>
            <Customers />
          </AppRoute>
        } />
        <Route path="/settings/*" element={
          <AppRoute variant="protected" accessLevel={[UserRoleName.ADMIN]}>
            <Settings />
          </AppRoute>
        } />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
```

## AppRoute Wrapper

```tsx
interface AppRouteProps {
  variant: 'protected' | 'anonymous';
  accessLevel?: UserRoleName[];
  tenantKey?: TenantFeatureKey;
  children: React.ReactNode;
}
```

- `variant="anonymous"` — accessible only when NOT logged in (login, signup)
- `variant="protected"` — requires authentication
- `accessLevel` — required roles to access
- `tenantKey` — feature flag gating

## Wildcard Routes

Use `/*` suffix for detail modals that don't change the main route:

```tsx
<Route path="/customers/*" element={...} />
```

This allows `/customers/123` to show customer detail in a modal overlay.

## Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' },
    },
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
  server: {
    open: true,
  },
});
```

## Rules

- ALWAYS use `React.lazy()` for view imports
- ALWAYS wrap routes in `Suspense` with `Loader` fallback
- Use `AppRoute` wrapper for all routes
- Wildcard `/*` for views with detail modals
