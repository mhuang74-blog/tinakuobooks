import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { CollectionCard } from '@/components/collection-card'
import { NewsletterSection } from '@/components/newsletter-section'
import { SectionHeading } from '@/components/section-heading'
import { WorksGrid } from '@/components/works-grid'
import { aboutParagraphs } from '@/content/about'
import { collections, getCollection } from '@/content/collections'
import {
  getAllWorks,
  getFeaturedWork,
  getWorksByCollection,
} from '@/lib/works'
import { SITE_DESCRIPTION_ZH, SITE_TITLE_ZH } from '@/lib/site'
import { buildMetadata, websiteJsonLd } from '@/lib/seo'
import { formatDate, ui } from '@/lib/i18n'

const strings = ui.zh

export const metadata: Metadata = {
  ...buildMetadata({
    locale: 'zh',
    title: SITE_TITLE_ZH,
    description: SITE_DESCRIPTION_ZH,
    path: '/',
    alternates: { zh: '/', en: '/en', xDefault: '/' },
    image: { url: '/og/home.jpg', alt: SITE_TITLE_ZH },
    keywords: ['郭瀞婷', 'Tina Kuo', '童書', '繪本', '兒童文學'],
  }),
  title: { absolute: SITE_TITLE_ZH },
}

export default function HomePage() {
  const works = getAllWorks()
  const featured = getFeaturedWork()
  const rest = works.filter((work) => work.slug !== featured.slug)
  const latest = rest.slice(0, 6)
  const featuredCollection = getCollection(featured.collectionId)

  return (
    <>
      <JsonLd data={websiteJsonLd('zh')} />

      <section className="relative isolate overflow-hidden bg-paper-deep">
        <img
          src="/images/blog-cover-tina.webp"
          alt="郭瀞婷"
          width={1600}
          height={1067}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 splash-scrim" />
        <div className="u-container flex min-h-[64svh] items-end pb-14 pt-32 sm:min-h-[72svh] sm:pb-20">
          <div className="hero-rise max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/80">
              郭瀞婷寫作
            </p>
            <h1 className="u-display mt-4 text-4xl leading-tight text-paper sm:text-5xl lg:text-6xl">
              讓故事延伸下去
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85">
              Celebrate stories created by my wife Tina Kuo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/works"
                className="u-focus inline-flex h-12 items-center rounded-full bg-paper px-6 text-sm font-medium tracking-[0.08em] text-ink transition-colors hover:bg-white"
              >
                {strings.exploreWorks}
              </Link>
              <a
                href="/about/"
                className="u-focus inline-flex h-12 items-center rounded-full border border-paper/60 px-6 text-sm font-medium text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                {strings.aboutAuthor}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="u-container mt-20" aria-labelledby="featured-heading">
        <p className="u-eyebrow">{strings.featured}</p>
        <div className="mt-6 grid gap-8 rounded-3xl border border-line bg-surface p-6 sm:p-8 md:grid-cols-[minmax(0,16rem)_1fr] md:items-center">
          <a
            href={`/${featured.slug}`}
            className="u-focus block overflow-hidden rounded-2xl bg-paper-deep"
          >
            <img
              src={featured.cover}
              alt={featured.title.zh}
              className="h-full w-full object-contain p-4"
            />
          </a>
          <div>
            <p
              className="u-eyebrow"
              style={{ color: featuredCollection.accent }}
            >
              {featuredCollection.name.zh}
            </p>
            <h2 id="featured-heading" className="u-display mt-2 text-2xl sm:text-3xl">
              {featured.title.zh}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {featured.description.zh}
            </p>
            <p className="mt-4 text-xs text-ink-muted">
              {formatDate(featured.date, 'zh')} · {strings.readingTime(featured.readingMinutes.zh)}
            </p>
            <a
              href={`/${featured.slug}`}
              className="u-focus mt-6 inline-flex h-11 items-center rounded-full bg-shell px-5 text-sm font-medium text-white transition-colors hover:bg-ink"
            >
              {strings.readWork}
            </a>
          </div>
        </div>
      </section>

      <section className="u-container mt-20" aria-label={strings.navCollections}>
        <SectionHeading
          eyebrow={strings.collectionsKicker}
          title={strings.allCollections}
          link={{ href: '/collections', label: strings.viewAllCollections }}
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              id={collection.id}
              locale="zh"
              count={getWorksByCollection(collection.id).length}
              href={`/tag/${collection.id}/`}
              linkMode="legacy"
            />
          ))}
        </div>
      </section>

      <section className="u-container mt-20" aria-label={strings.latestWorks}>
        <SectionHeading
          eyebrow={strings.worksKicker}
          title={strings.latestWorks}
          link={{ href: '/works', label: strings.viewAllWorks }}
        />
        <div className="mt-6">
          <WorksGrid works={latest} locale="zh" linkMode="legacy" />
        </div>
      </section>

      <section className="u-container mt-20" aria-label={strings.aboutKicker}>
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
          <p className="u-eyebrow">{strings.aboutKicker}</p>
          <h2 className="u-display mt-2 max-w-3xl text-2xl leading-relaxed sm:text-3xl">
            {aboutParagraphs.zh[0]}
          </h2>
          <a
            href="/about/"
            className="u-focus mt-6 inline-flex items-center gap-2 text-sm font-medium text-shell hover:underline"
          >
            {strings.moreAbout}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="u-container mt-20">
        <NewsletterSection locale="zh" idPrefix="home-newsletter" />
      </section>
    </>
  )
}
