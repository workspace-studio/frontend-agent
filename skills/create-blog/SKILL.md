---
name: create-blog
description: Add one blog post from pasted text — writes the md file per locale with full translations, the localized slug map entries, and banner/card images. Use for "dodaj blog", "new blog post", "objavi članak".
argument-hint: "[title — or nothing, it will ask]"
---

# Create Blog (one post)

Usage: `/create-blog` then paste the post, or `/create-blog Post title`

## Pre-Work

1. READ @knowledge/28-markdown-content.md
2. READ **one existing post per locale** from `src/files/blog/{locale}/` — the frontmatter shape and the writing tone are the template, match them exactly
3. READ `src/types/blog.type.ts` for the live `BlogCategory` union, and `src/i18n/routing.ts` + `src/config/slugs.config.ts` for the shape of the two slug maps
4. `src/files/blog` missing → the system isn't installed, run `/add-blog` first and stop

## Steps

### Step 1: Gather (ask ONLY for what's missing — AskUserQuestion where available)

- **Title** — per locale, or the default-locale title and the rest translated
- **Text** — pasted content, or "draft it" (then ask topic, key points, target length, and draft in the tone of the existing posts)
- **Description** ~150 chars — propose one from the text, confirm it
- **Categories** — offer the union values as choices. A value outside the union is a deliberate type extension, confirm it explicitly before touching `blog.type.ts`
- **Author** — offer the authors found in existing posts; a new author needs name, role, and an avatar into `public/images/avatars/`
- **Featured** — default false
- **Image** — a file or path from the user if there is one. Otherwise **generate placeholders**: flat colour `banner.webp` + `card.webp` at the right dimensions so every referenced path resolves and the build stays green. Placeholders are the normal case here, not a failure — list them in the report and in the PR body as TODO replace. Never fill the gap with stock or AI imagery, and never ship a post pointing at a file that does not exist
- **Date** — today unless told otherwise

### Step 2: Slugs (canonical + one per locale)

Kebab-case from the default-locale title, SEO-sensible, unique against `getAllBlogSlugs`. That value is the **canonical slug** and goes into every locale's frontmatter unchanged — only the filename is translated.

Then derive a **localized URL slug per non-default locale** from that locale's title (Croatian title → Croatian slug, no English words left in it). Those are what visitors see; they are registered in Step 3, not in the frontmatter.

### Step 3: Write the files

```
src/files/blog/{default}/{slug}.md
src/files/blog/{other}/{translated-filename}.md   # SAME canonical slug in frontmatter
src/i18n/routing.ts                               # pathnames: '/blog/{en-slug}': { hr: '/blog/{hr-slug}' }
src/config/slugs.config.ts                        # blogPostsSlugMap: { id: '{slug}', slugs: { en, hr, … } }
public/images/blog/{imageSlug}/banner.webp        # ~1600×900, match existing posts
public/images/blog/{imageSlug}/card.webp          # ~800×450
```

- **Both maps are mandatory, one entry per locale each.** Skip them and the post still renders on the default locale while the localized URL 404s — and nothing fails the build, so this is the step to check twice
- Placement: append the `blogPostsSlugMap` object to the END of the array; put the `pathnames` entry with the other `/blog/...` entries, which are grouped in insertion order and not sorted
- `imageSlug` defaults to `slug`. The existing non-default-locale files set it explicitly anyway — read one and match it rather than dropping it
- Frontmatter exactly per the contract in @knowledge/28-markdown-content.md; @examples/markdown/post-template.md is the skeleton
- Body: headings start at `##`, GFM allowed, in-content images referenced as `/images/blog/{imageSlug}/name.webp` with alt text that describes the frame, internal links relative and localized
- Provided image → convert and crop to webp banner + card with sharp
- **Translate the post in full into every locale in `routing.locales`** — the whole body, not a summary, in that locale's register. Croatian posts read as Croatian, not as translated English. Technical terms and code stay as they are. If a locale can't be translated well, say which one and why rather than shipping filler

### Step 4: Validate + ship

`yarn build && yarn lint`, then open **each locale's URL**: the post appears in the listing, the localized detail route renders, metadata and JSON-LD are present, and the language switcher moves between the two URLs. A localized URL that 404s means a missing map entry from Step 3, nothing else.

Then offer `/create-pr`. The diff must contain ONLY the six paths above, plus `blog.type.ts` if a category was deliberately added. Anything else means stop and explain — routes, sitemap and feeds derive the post automatically, so a post PR that edits them is a sign the system is broken.
