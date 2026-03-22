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

## Font Optimization (Next.js)

```tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({ weight: ['600', '700'], subsets: ['latin'] });
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
