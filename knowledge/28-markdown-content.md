# Markdown Content — Blogs & Static Pages (the `files/` model, Next.js)

Content lives in versioned `.md` files, not in components and not in a CMS. Change content = edit a text file; the system handles structure, rendering, and SEO. Every blog PR looks the same. **Next.js only** — the model assumes server components, `generateStaticParams` and filesystem reads at build time. On React+Vite there is no equivalent; say so instead of improvising one.

## Structure

```
src/files/
├── blog/
│   ├── en/{slug}.md              # one file per post per locale
│   └── hr/{translated-filename}.md
└── static/
    ├── en/{page}.md              # privacy-policy, faq, legal-info, …
    └── hr/{page}.md
public/images/blog/{imageSlug}/
├── banner.webp                   # post hero (detail page)
├── card.webp                     # listing card
└── *.webp                        # optional in-content images
public/images/avatars/{name}.webp
```

## Frontmatter contract (blog)

```yaml
---
title: 'Post title'
slug: post-slug                    # SHARED across locales — the URL key; HR file keeps the EN slug value
imageSlug: post-slug               # optional — defaults to slug; shares one image folder across locales
description: 'Meta description (~150 chars) — used for SEO and cards'
date: 2026-07-18
categories: [development]          # from the typed BlogCategory union — never invent values
featured: false                    # featured posts surface on top of the listing
author:
  name: Full Name
  role: Software Engineer
  avatar: /images/avatars/name.webp
---
```

Rules: the **`slug` value is identical in every locale file** (one canonical URL key; only the filename is translated). `categories` is an array validated against `src/types/blog.type.ts` (`BlogCategory` union — extend the union deliberately, never ad-hoc). Legacy single `category` is read-supported but never written.

## Pipeline (`src/lib/page.ts` — see @examples/markdown/page.ts)

gray-matter (frontmatter) + remark → HTML: `remark().use(remarkGfm).use(remarkRehype, {allowDangerousHtml: true}).use(rehypeRaw).use(rehypeStringify, {allowDangerousHtml: true})` — GFM tables/strikethrough plus raw inline HTML pass-through. Deps:

```bash
yarn add gray-matter remark remark-gfm remark-rehype rehype-raw rehype-stringify
```

API surface: `getBlogPosts(locale)` (sorted by date desc, computes `readTime` via estimateReadingTime, resolves banner/card image paths), `getFeaturedBlogPosts`, `getNonFeaturedBlogPosts`, `getBlogPostsByCategory`, `getOtherBlogPosts(locale, excludeSlug)` (related-posts strip), `getBlogPost(locale, slug)` (finds by frontmatter slug — filename-independent), `getAllBlogSlugs` (feeds `generateStaticParams`), `getPage(locale, 'static'|'blogs', fileName)` (static page → HTML string).

The example keeps `FAQItem`/`FAQGroup` in `blog.type.ts`; some projects split them into `src/types/faq.type.ts`. Read the project first and match it — do not move existing types.

## Localized URLs — the frontmatter slug is NOT the URL

The frontmatter `slug` is the canonical key (the default-locale slug, identical in every locale file). The URL a visitor sees is localized, and that mapping lives in TWO places that must be updated together with every new post:

```ts
// src/i18n/routing.ts — next-intl pathnames, this is what actually routes
'/blog/how-to-use-markdown-to-make-static-pages-and-blog-posts': {
  hr: '/blog/kako-koristiti-markdown-za-staticke-stranice-i-blogove',
},

// src/config/slugs.config.ts — blogPostsSlugMap, what metadata/sitemap/LanguagePicker read
{
  id: 'how-to-use-markdown-to-make-static-pages-and-blog-posts',
  slugs: {
    en: 'how-to-use-markdown-to-make-static-pages-and-blog-posts',
    hr: 'kako-koristiti-markdown-za-staticke-stranice-i-blogove',
  },
},
```

`getTranslatedBlogSlug(canonicalSlug, targetLocale, currentLocale)` reads the second map and feeds hreflang alternates, the sitemap and the language switcher. `getBlogPost(locale, slug)` matches on the **canonical** frontmatter slug, so a post missing from these maps still renders on the default locale and quietly 404s or falls back everywhere else. Miss them and nothing throws at build time — that is exactly why they are the easiest step to forget.

## Routes

- Listing: `app/[locale]/(public)/blog/page.tsx` — featured on top, category filter from the union, cards from `getBlogPosts`
- Detail: `app/[locale]/(public)/blog/[slug]/page.tsx` — `generateMetadata` from frontmatter (title, description, OG image = bannerImage, hreflang alternates — same slug across locales makes alternates trivial); render HTML via `dangerouslySetInnerHTML` inside the post layout (author header, date, readTime, categories chips). `generateStaticParams` from `getAllBlogSlugs` per locale ONLY if the project already prerenders its other collections that way — the reference implementation renders blog detail on demand and prerenders `services/[slug]`, so copy whatever the neighbouring dynamic route does instead of deciding fresh
- Static page: route under `(static)` calls `getPage(locale, 'static', 'privacy-policy')` → rendered in a prose container; 404 via `notFound()` when the file is missing for the locale

## FAQ special case

`faq.md` uses a structural convention parsed into accordion groups: `# Group title` → group, `## Question` → item, body until next heading = answer (markdown → HTML per answer). `getFAQPage` / `getFAQByCategory(locale, type, file, category)` return `FAQGroup[]` ready for an Accordion component.

## Images

- Post images: `public/images/blog/{imageSlug}/banner.webp` + `card.webp` — BOTH required per post, shared across locales via imageSlug; in-content images live in the same folder and are referenced as `/images/blog/{imageSlug}/name.webp`
- Always `.webp`; convert on ingest (`npx sharp-cli -i in.png -o banner.webp` or a sharp one-liner). Sensible sizes: banner ~1600×900 (16:9), card ~800×450 — match whatever the existing posts use, read one first
- New author → avatar to `public/images/avatars/{first-name}.webp`

## Discovery artifacts — what a post owes beyond the HTML page

The post file is the source; everything below is derived and must never be hand-maintained per post.

- **JSON-LD** on the detail route: `buildBlogPostingSchema(post, locale, urlPath)` **and** `buildBreadcrumbSchema` from `src/lib/jsonld.ts`, both injected with the `JsonLd` component from @knowledge/13-seo-metadata.md — the XSS escape there is mandatory. BlogPosting fields come from frontmatter: headline, description, datePublished, image = absolute bannerImage URL, author as `Person` with `jobTitle`, `inLanguage` from the locale
- **Sitemap**: entries generated from `getBlogPosts` on the default locale, each locale's URL resolved through `getTranslatedBlogSlug`, `lastModified` from the frontmatter date. A post never gets a hand-written sitemap line — but it DOES need its slug-map entry, or the localized URL in the sitemap is wrong
- **RSS**: optional and not present in the reference project. If asked for, `app/rss.xml/route.ts` (or per-locale) mapping `getBlogPosts(locale)`, linked with `<link rel="alternate" type="application/rss+xml">` in the layout. Do not add it uninvited
- **Markdown + JSON variants**: if the project ran `/setup-markdown-negotiation`, blog detail routes serve the raw markdown under `Accept: text/markdown` for free — the source file IS the markdown, so pass the frontmatter through as YAML rather than re-serializing. `/setup-api-catalog` exposes the same posts as JSON
- **llms.txt**: when the project has one, the blog index belongs in it; individual posts do not

## The blog PR anatomy (every post PR looks the SAME)

```
src/files/blog/en/{slug}.md
src/files/blog/hr/{translated-filename}.md      # same canonical slug in frontmatter
src/i18n/routing.ts                             # pathnames entry: en URL -> hr URL
src/config/slugs.config.ts                      # blogPostsSlugMap entry
public/images/blog/{imageSlug}/banner.webp
public/images/blog/{imageSlug}/card.webp
(+ optional in-content images in the same folder)
(+ src/types/blog.type.ts ONLY when a new category was deliberately added)
```

Reference PR (workspace-agency #160, one AI-search post in en + hr) changed exactly: 4 files under `public/images/blog/ai-search-visibility-infrastructure/` (banner, card, two in-content diagrams), `src/config/slugs.config.ts`, `src/files/blog/en/ai-search-visibility-infrastructure.md`, `src/files/blog/hr/zasto-vas-ai-trazilice-ne-pronalaze.md`, `src/i18n/routing.ts`. No route, component, sitemap or type change. That is the shape to reproduce.

Those six are the whole PR. No component edits, no route edits, no sitemap edit, no RSS edit — listing, detail, metadata, alternates and sitemap all derive from the files and the two maps. If a post PR touches anything beyond this list, something is wrong: either the system is missing a derivation it should be doing, or the post is smuggling in unrelated work. If a post PR is MISSING one of the two maps, the localized URL is broken and no build error will tell you.

## SEO checklist per post

frontmatter description ~150 chars · date real (drives sorting + sitemap lastmod) · `generateMetadata` emits OG/Twitter from banner · hreflang via shared slug · headings start at `##` in the body (post title is the page `<h1>`) · internal links relative, localized · every in-content image has real alt text describing the frame, never the post title
