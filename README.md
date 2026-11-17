# tinakuobooks.com

Bilingual (Traditional Chinese / English) portfolio for the works of Tina Kuo
(郭瀞婷). Built with Next.js App Router and exported as a fully static site for
GitHub Pages — no server runtime, no CMS, no image optimizer service.

## Requirements

- Node.js 22 (`>=20.9.0` is the hard floor for Next 16 and `sharp`)
- pnpm 10 (`corepack enable pnpm`, pinned via `packageManager`)

## Commands

```bash
pnpm install          # install dependencies
pnpm run dev          # local dev server on http://localhost:3000
pnpm run build        # content validation, static export, legacy URL post-processing
pnpm run start        # serve the exported out/ directory on port 3000
pnpm run lint         # eslint
pnpm run typecheck    # tsc --noEmit
pnpm run test:e2e     # Playwright suite (builds and serves automatically)
pnpm run images       # regenerate WebP covers, OG images, and the legacy PDF copy
```

`pnpm run build` runs two extra steps:

1. `prebuild` → `scripts/validate-content.ts` fails the build on broken front
   matter, duplicate English slugs, missing covers, or stale `<!--more-->`
   markers.
2. `postbuild` → `scripts/postbuild.mjs` moves `about`, `tag/*`, and `author/*`
   HTML into directory indexes, drops the percent-encoded duplicate pages that
   Next emits for non-ASCII slugs, copies every remaining page into its sibling
   RSC payload directory so extensionless URLs resolve under either static-host
   lookup order, writes `.nojekyll` and `CNAME`, and asserts that the custom
   `404.html` exists.

## Content

All content lives in the repository; there is no CMS.

```
content/
  works/zh/<legacy-slug>.md   canonical work: title, description, date, author, collection, cover
  works/en/<legacy-slug>.md   optional English translation: title, description, slug, body
  collections.ts              the five collections (names, descriptions, covers, accents)
  authors.ts                  author profiles
  about.ts                    about copy for the home teaser and the about pages
  portfolio.ts                home presentation data: shelf order, tags, cover art,
                              reader notes, excerpts, and all home-page copy
```

- Pairing is by filename. `content/works/en/57號小豹.md` is the English version
  of `content/works/zh/57號小豹.md`.
- `date` is always a quoted `YYYY-MM-DD` string. It is interpreted in
  `Asia/Taipei` so server and client render the same date.
- The Chinese filename is the legacy public URL (`/<slug>`); never rename it
  without adding a redirect at the hosting layer.
- `featuredSlug` in `content/portfolio.ts` chooses the homepage hero and dialog
  entry. `portfolioWorks` order is the shelf order (newest first) and must cover
  every work; `scripts/validate-content.ts` fails when a slug is missing.

### Missing or partial translations

- No English file → no English route is generated, the English index omits the
  work, and the Chinese page shows `英文版準備中` / English translation coming soon.
- English file with an empty body → the English page keeps the English title and
  description but renders the Chinese body with a notice.
- `scripts/validate-content.ts` warns (does not fail) in both cases.

## Legacy URL policy

Every URL from the Jekyll site keeps working:

| URL | Served from |
| --- | --- |
| `/` | `out/index.html` |
| `/<chinese-slug>` | `out/<chinese-slug>.html` (no trailing slash) |
| `/tag/<collection>/` | `out/tag/<collection>/index.html` |
| `/author/<author>/` | `out/author/<author>/index.html` |
| `/about/` | `out/about/index.html` |
| `/feed.xml`, `/atom.xml`, tag/author feeds | static route handlers |
| `/assets/files/57號小豹著色本.pdf` | `out/assets/files/` |

Chinese legacy routes are linked with plain `<a>` elements so navigation is a
full page load and never depends on an RSC payload for a moved HTML file. New
routes (`/works`, `/collections`, `/en/**`) use `next/link`.

## Images

`assets/source-images/` holds the originals and is not deployed.
`pnpm run images` writes:

- `public/images/<name>.webp` — max width 1600 (800 for author photos)
- `public/og/<name>.jpg` — 1200×630 Open Graph cards for covers and the homepage
- `public/assets/files/57號小豹著色本.pdf` — legacy download

The generated files are committed. Re-run the script when adding new artwork.

## Deployment

`.github/workflows/deploy.yml` runs on every push to `master`:

1. `verify`: `pnpm install --frozen-lockfile`, lint, typecheck, build, Playwright
   against the exported site.
2. `deploy`: rebuilds and publishes `out/` to the `gh-pages` branch with the
   `www.tinakuobooks.com` CNAME.

GitHub Pages serves from `gh-pages`, which matches the previous setup.

## Licence

Site content is licensed under CC-BY-4.0 with attribution. The `LICENSE`,
`LICENSE_GHOST`, and `LICENSE_JASPER2` files cover the original theme and the
source artwork carried over from the Jekyll site.
