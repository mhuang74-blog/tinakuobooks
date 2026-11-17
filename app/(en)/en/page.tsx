import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import { CollectionCard } from '@/components/collection-card'
import { NewsletterSection } from '@/components/newsletter-section'
import { SectionHeading } from '@/components/section-heading'
import { WorksGrid } from '@/components/works-grid'
import { aboutParagraphs } from '@/content/about'
import { collections, getCollection } from '@/content/collections'
import { getTranslatedWorks } from '@/lib/works'
import { SITE_DESCRIPTION_EN, SITE_TITLE_EN } from '@/lib/site'
import { buildMetadata, websiteJsonLd } from '@/lib/seo'
import { formatDate, ui, workHref } from '@/lib/i18n'

const strings = ui.en

export const metadata: Metadata = {
  ...buildMetadata({
    locale: 'en',
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    path: '/en',
    alternates: { zh: '/', en: '/en', xDefault: '/' },
    image: { url: '/og/home.jpg', alt: SITE_TITLE_EN },
    keywords: ['Tina Kuo', 'children books', 'picture book', 'Taiwan author'],
  }),
  title: { absolute: SITE_TITLE_EN },
}

export default function EnHomePage() {
  const works = getTranslatedWorks()
  const featured = works.find((work) => work.featured) ?? works[0]
  const rest = works.filter((work) => work.slug !== featured.slug)
  const latest = rest.slice(0, 6)
  const featuredCollection = getCollection(featured.collectionId)
  const translatedByCollection = (id: (typeof collections)[number]['id']) =>
    works.filter((work) => work.collectionId === id).length

  return (
    <>
      <JsonLd data={websiteJsonLd('en')} />

      <section className="relative isolate overflow-hidden bg-paper-deep">
        <img
          src="/images/blog-cover-tina.webp"
          alt="Tina Kuo"
          width={1600}
          height={1067}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 splash-scrim" />
        <div className="u-container flex min-h-[64svh] items-end pb-14 pt-32 sm:min-h-[72svh] sm:pb-20">
          <div className="hero-rise max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/80">
              {SITE_TITLE_EN}
            </p>
            <h1 className="u-display mt-4 text-4xl leading-tight text-paper sm:text-5xl lg:text-6xl">
              {SITE_DESCRIPTION_EN}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/85">
              Books, picture books, and stage stories by Tina Kuo — collected and
              extended by her family.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/en/works"
                className="u-focus inline-flex h-12 items-center rounded-full bg-paper px-6 text-sm font-medium tracking-[0.08em] text-ink transition-colors hover:bg-white"
              >
                {strings.exploreWorks}
              </Link>
              <Link
                href="/en/about"
                className="u-focus inline-flex h-12 items-center rounded-full border border-paper/60 px-6 text-sm font-medium text-paper transition-colors hover:border-paper hover:bg-paper/10"
              >
                {strings.aboutAuthor}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="u-container mt-20" aria-labelledby="featured-heading">
        <p className="u-eyebrow">{strings.featured}</p>
        <div className="mt-6 grid gap-8 rounded-3xl border border-line bg-surface p-6 sm:p-8 md:grid-cols-[minmax(0,16rem)_1fr] md:items-center">
          <Link
            href={workHref('en', featured)}
            className="u-focus block overflow-hidden rounded-2xl bg-paper-deep"
          >
            <img
              src={featured.cover}
              alt={featured.title.en}
              className="h-full w-full object-contain p-4"
            />
          </Link>
          <div>
            <p className="u-eyebrow" style={{ color: featuredCollection.accent }}>
              {featuredCollection.name.en}
            </p>
            <h2 id="featured-heading" className="u-display mt-2 text-2xl sm:text-3xl">
              {featured.title.en}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {featured.description.en}
            </p>
            <p className="mt-4 text-xs text-ink-muted">
              {formatDate(featured.date, 'en')} · {strings.readingTime(featured.readingMinutes.en)}
            </p>
            <Link
              href={workHref('en', featured)}
              className="u-focus mt-6 inline-flex h-11 items-center rounded-full bg-shell px-5 text-sm font-medium text-white transition-colors hover:bg-ink"
            >
              {strings.readWork}
            </Link>
          </div>
        </div>
      </section>

      <section className="u-container mt-20" aria-label={strings.navCollections}>
        <SectionHeading
          eyebrow={strings.collectionsKicker}
          title={strings.allCollections}
          link={{ href: '/en/collections', label: strings.viewAllCollections }}
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              id={collection.id}
              locale="en"
              count={translatedByCollection(collection.id)}
              href={`/en/collections/${collection.id}`}
              linkMode="next"
            />
          ))}
        </div>
      </section>

      <section className="u-container mt-20" aria-label={strings.latestWorks}>
        <SectionHeading
          eyebrow={strings.worksKicker}
          title={strings.latestWorks}
          link={{ href: '/en/works', label: strings.viewAllWorks }}
        />
        <div className="mt-6">
          <WorksGrid works={latest} locale="en" linkMode="next" />
        </div>
      </section>

      <section className="u-container mt-20" aria-label={strings.aboutKicker}>
        <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
          <p className="u-eyebrow">{strings.aboutKicker}</p>
          <h2 className="u-display mt-2 max-w-3xl text-2xl leading-relaxed sm:text-3xl">
            {aboutParagraphs.en[0]}
          </h2>
          <Link
            href="/en/about"
            className="u-focus mt-6 inline-flex items-center gap-2 text-sm font-medium text-shell hover:underline"
          >
            {strings.moreAbout}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="u-container mt-20">
        <NewsletterSection locale="en" idPrefix="home-newsletter" />
      </section>
    </>
  )
}
