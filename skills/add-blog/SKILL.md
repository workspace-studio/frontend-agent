---
name: add-blog
description: Install the markdown blog SYSTEM into a Next.js project — files/ structure, md pipeline, typed categories, localized slug maps, listing + detail routes, JSON-LD and sitemap wiring. One-time setup; individual posts are /create-blog.
disable-model-invocation: true
---

# Add Blog (system setup)

Usage: `/add-blog — categories: development, design, ai`

## Pre-Work

1. READ the project's CLAUDE.md
2. READ @knowledge/28-markdown-content.md — the whole model, this skill implements it
3. READ @knowledge/13-seo-metadata.md (JsonLd component, sitemap, OG image) and @knowledge/08-i18n-nextintl.md (locale list comes from `routing.locales`, nowhere else)
4. Detect stack from package.json. **Next.js only.** On React+Vite there is no filesystem content model — stop, say the blog needs SSG, and offer a CMS-backed view instead
5. `src/files/blog` already present → the system exists, stop and point at `/create-blog`

## Steps

### Step 1: Deps

```bash
yarn add gray-matter remark remark-gfm remark-rehype rehype-raw rehype-stringify
```

### Step 2: Types

`src/types/blog.type.ts` from @examples/markdown/blog.type.ts. The `BlogCategory` union holds exactly the categories the user named — ask if they didn't. FAQ types go where the project already keeps them.

### Step 3: Pipeline

`src/lib/page.ts` from @examples/markdown/page.ts. It needs `estimateReadingTime` in `src/utils/static/` — create it if missing (words / 200, rounded up, returned as the project's existing read-time string format).

### Step 4: Structure

```
src/files/blog/{locale}/        # one folder per locale in routing.locales
src/files/static/{locale}/
public/images/blog/
public/images/avatars/
```

### Step 5: Routes

- Listing `app/[locale]/(public)/blog/page.tsx` — featured strip, category filter over the union, cards from `getBlogPosts(locale)`
- Detail `app/[locale]/(public)/blog/[slug]/page.tsx` — `generateMetadata` from frontmatter (OG banner + hreflang alternates resolved through `getTranslatedBlogSlug`), related posts from `getOtherBlogPosts`. `generateStaticParams` from `getAllBlogSlugs` per locale ONLY if the project already prerenders its other dynamic collections that way — copy whatever the neighbouring dynamic route does, do not decide fresh
- `BlogCard` and the category chips are normal components per @knowledge/03-component-patterns.md — typed props, no `any`, SCSS module. Check @examples/shared-components/ before writing anything that already exists there

### Step 6: Localized slug maps (the URL layer — build it now or every post ships broken)

The frontmatter slug is the canonical key, NOT the visible URL. Two maps carry the localized URLs and both must exist before the first post:

- `src/i18n/routing.ts` — `pathnames` holds `'/blog'` and later one entry per post (`'/blog/en-slug': { hr: '/blog/hr-slug' }`)
- `src/config/slugs.config.ts` — `blogPostsSlugMap`, an array of `{ id, slugs: { en, hr, … } }`, plus `getTranslatedBlogSlug(slug, targetLocale, currentLocale)` reading it. hreflang alternates, the sitemap and the language switcher all go through this helper

Create the config and the helper if the project has neither; wire them into the existing switcher rather than adding a second one. A missing entry throws nothing at build time — state that in the report so the per-post step is taken seriously.

### Step 7: Derived artifacts (the part that gets forgotten)

- **JSON-LD** on the detail route: `buildBlogPostingSchema(post, locale, urlPath)` **and** `buildBreadcrumbSchema`, both injected with the `JsonLd` component from @knowledge/13-seo-metadata.md (the XSS escape there is mandatory)
- **Sitemap** — entries from `getBlogPosts` on the default locale, each locale's URL resolved through `getTranslatedBlogSlug`, `lastModified` from the frontmatter date. Never a hand-written line per post
- **RSS — only if asked.** It is not part of the reference implementation. When requested: `app/rss.xml/route.ts` from `getBlogPosts` plus the `<link rel="alternate" type="application/rss+xml">` in the layout. Do not add it uninvited
- If the project already ran `/setup-markdown-negotiation` or `/setup-api-catalog`, extend their route maps to cover `/blog/[slug]` now, while the shape is fresh

### Step 8: Translations

Blog UI strings (read time, "all posts", category labels, empty state) into EVERY locale message file in the same commit. A key that exists in one locale and not another is a bug, not a TODO.

### Step 9: Seed post

One example post per locale sharing a canonical slug, with a placeholder banner + card AND its entries in both maps from Step 6 — that is what proves the URL layer works. Say clearly in the report that it is a placeholder to delete.

### Step 10: Validate

`yarn build && yarn lint` — listing renders, detail renders on every locale (open the localized URL, not just the default one), metadata and JSON-LD present. Report what was created and that new posts go through `/create-blog`.
