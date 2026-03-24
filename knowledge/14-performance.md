# Performance

## Image Optimization

Always use `next/image` (Next.js) with `sizes` prop:

```tsx
import Image from 'next/image';

<Image
  src="/images/hero.webp"
  alt="Hero image"
  fill
  sizes="(min-width: 1200px) 50vw, 100vw"
  className={styles.image}
/>
```

Configure `remotePatterns` in `next.config.js` for external images.

## Code Splitting

**React+Vite** — lazy load all views:
```tsx
const Dashboard = lazy(() => import('@/views/Dashboard'));

<Suspense fallback={<Loader />}>
  <Dashboard />
</Suspense>
```

**Next.js** — automatic per-route splitting. Use `dynamic` for heavy components:
```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <Loader />,
});
```

## Font Loading

Fonts MUST be self-hosted as local files. **NEVER** use Google Fonts links, CDN imports, or `next/font/google`.

1. Download `.woff2` files from the font's official site (e.g., Google Fonts → download family → extract `.woff2`)
2. Place in `public/fonts/` (Next.js) or `src/assets/fonts/` (React+Vite)
3. Declare `@font-face` in `src/styles/globals/fonts.scss`

```scss
// src/styles/globals/fonts.scss
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Poppins';
  src: url('/fonts/Poppins-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Import in `src/styles/index.scss`:
```scss
@use 'globals/fonts';
```

## Bundle Analysis

```bash
ANALYZE=true yarn build
```

Configure in next.config.js:
```javascript
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: true });
  module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
}
```

## Vite Chunk Size

```typescript
// vite.config.ts
build: {
  chunkSizeWarningLimit: 3000,
}
```

## Hydration Mismatches

Avoid by using `useEffect` for client-only rendering:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (!mounted) return null;
```

## Forbidden Patterns

- **NEVER use `React.memo`** — adds complexity without meaningful benefit
- **NEVER use `useMemo`** — trust React's rendering
- **NEVER use `useCallback`** — write simple functions
- **NEVER use `any` or `unknown`** — always define proper types
