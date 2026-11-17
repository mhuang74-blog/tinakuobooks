# tinakuobooks.com

Bilingual (Traditional Chinese / English) portfolio for the works of Tina Kuo
(郭瀞婷). Built with Next.js App Router and served by the native Next runtime on
Vercel — no CMS, no separate image optimizer service.

## Requirements

- Node.js 22 (`>=20.9.0` is the hard floor for Next 16 and `sharp`)
- npm 10+

## Commands

```bash
npm install          # install dependencies
npm run dev          # local dev server on http://localhost:3000
npm run build        # content validation, then next build
npm run start        # serve the production build on port 3000
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test:e2e     # Playwright suite (builds and serves automatically)
npm run images       # regenerate WebP covers, OG images, and the legacy PDF copy
```

`npm run build` runs `prebuild` → `scripts/validate-content.ts` first, which
fails the build on broken front matter, duplicate English slugs, missing covers,
or stale `<!--more-->` markers. `vercel.json` pins `buildCommand` to
`npm run build` so the same validation runs on Vercel.

## Content

All content lives in the repository; there is no CMS.

```
content/
  works/zh/<legacy-slug>.md   canonical work: title, description, date, author, collection, cover
  works/en/<legacy-slug>.md   optional English translation: title, description, slug, body
  collections.ts              the five collections (names, descriptions, covers, accents)
  authors.ts                  author profiles
  about.ts                    about copy for the home teaser and the about pages
```

- Pairing is by filename. `content/works/en/57號小豹.md` is the English version
  of `content/works/zh/57號小豹.md`.
- `date` is always a quoted `YYYY-MM-DD` string. It is interpreted in
  `Asia/Taipei` so server and client render the same date.
- The Chinese filename is the legacy public URL (`/<slug>`); never rename it
  without adding a redirect at the hosting layer.
- `featured: true` on exactly one work drives the homepage hero. Move the flag
  to change the hero.

### Missing or partial translations

- No English file → no English route is generated, the English index omits the
  work, and the Chinese page shows `英文版準備中` / English translation coming soon.
- English file with an empty body → the English page keeps the English title and
  description but renders the Chinese body with a notice.
- `scripts/validate-content.ts` warns (does not fail) in both cases.

## Legacy URL policy

Every URL from the Jekyll site keeps working against the native Next runtime:

| URL | Served by |
| --- | --- |
| `/` | `app/(zh)/page.tsx` |
| `/<chinese-slug>` | `app/(zh)/[slug]/page.tsx` (no trailing slash) |
| `/tag/<collection>/` | `app/(zh)/tag/[slug]/page.tsx`; the trailing slash 308-redirects to `/tag/<collection>` |
| `/author/<author>/` | `app/(zh)/author/[id]/page.tsx`; the trailing slash 308-redirects to `/author/<author>` |
| `/about/` | `app/(zh)/about/page.tsx`; the trailing slash 308-redirects to `/about` |
| `/feed.xml`, `/atom.xml`, tag/author feeds | route handlers |
| `/assets/files/57號小豹著色本.pdf` | `public/assets/files/` |

Chinese legacy routes are linked with plain `<a>` elements so navigation is a
full page load and never depends on an RSC payload for a moved HTML file. New
routes (`/works`, `/collections`, `/en/**`) use `next/link`.

## Images

`assets/source-images/` holds the originals and is not deployed.
`npm run images` writes:

- `public/images/<name>.webp` — max width 1600 (800 for author photos)
- `public/og/<name>.jpg` — 1200×630 Open Graph cards for covers and the homepage
- `public/assets/files/57號小豹著色本.pdf` — legacy download

The generated files are committed. Re-run the script when adding new artwork.

## Deployment

The app is a native Next.js app (no `output: 'export'`), hosted on Vercel:

| Target | Trigger |
| --- | --- |
| Preview | `vercel deploy` from the working tree |
| Production | Vercel Git integration on `master` (not enabled yet) |

`vercel.json` sets `framework: "nextjs"` and `buildCommand: "npm run build"`.
The project (`tinakuobooks` under `mhuang74s-projects`) runs Node 22.x;
`.vercel/` is gitignored.

`www.tinakuobooks.com` still resolves to the `gh-pages` branch until the DNS
cutover, so the static export in that branch stays live. The Pages workflow
that used to rebuild it has been removed; do not re-add `postbuild` or an
`out/` publish step.

## Licence

Site content is licensed under CC-BY-4.0 with attribution. The `LICENSE`,
`LICENSE_GHOST`, and `LICENSE_JASPER2` files cover the original theme and the
source artwork carried over from the Jekyll site.
