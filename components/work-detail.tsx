import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { NewsletterSection } from '@/components/newsletter-section'
import { ReadingProgress } from '@/components/reading-progress'
import { ShareButtons } from '@/components/share-buttons'
import { WorkCard } from '@/components/work-card'
import { getAuthor } from '@/content/authors'
import { getCollection } from '@/content/collections'
import {
  authorHref,
  collectionHref,
  formatDate,
  homeHref,
  ui,
  workHref,
  worksHref,
  type Locale,
} from '@/lib/i18n'
import { Markdown } from '@/lib/markdown'
import { absoluteUrl } from '@/lib/site'
import type { Work } from '@/lib/works'
import { toWorkCardData } from '@/lib/work-card'
import { workJsonLd, workPath } from '@/lib/seo'

type Props = {
  work: Work
  locale: Locale
  newer?: Work
  older?: Work
  related: Work[]
}

export function WorkDetail({ work, locale, newer, older, related }: Props) {
  const strings = ui[locale]
  const collection = getCollection(work.collectionId)
  const author = getAuthor(work.authorId)
  const linkMode = locale === 'zh' ? 'legacy' : 'next'
  const title = work.title[locale]
  const bodyLang =
    locale === 'en' && work.translationPending ? 'zh-Hant' : locale === 'en' ? 'en' : 'zh-Hant'

  const collectionCard =
    linkMode === 'legacy' ? (
      <a
        href={collectionHref(locale, collection.id)}
        className="u-eyebrow hover:underline"
        style={{ color: collection.accent }}
      >
        {collection.name[locale]}
      </a>
    ) : (
      <Link
        href={collectionHref(locale, collection.id)}
        className="u-eyebrow hover:underline"
        style={{ color: collection.accent }}
      >
        {collection.name[locale]}
      </Link>
    )

  const authorCard =
    linkMode === 'legacy' ? (
      <a href={authorHref(locale, author.id)} className="u-focus hover:text-shell">
        {author.name[locale]}
      </a>
    ) : (
      <Link href={authorHref(locale, author.id)} className="u-focus hover:text-shell">
        {author.name[locale]}
      </Link>
    )

  const notice =
    locale === 'zh' && !work.slugEn
      ? '英文版準備中 English translation coming soon'
      : locale === 'en' && work.translationPending
        ? 'English translation pending. The original Chinese text is shown below.'
        : null

  return (
    <article className="pb-16">
      <ReadingProgress />
      <JsonLd data={workJsonLd(work, locale)} />

      <div className="u-container pt-8">
        <Breadcrumbs
          items={[
            { label: strings.home, href: homeHref(locale), legacy: linkMode === 'legacy' },
            { label: strings.navWorks, href: worksHref(locale), legacy: linkMode === 'legacy' },
            { label: title },
          ]}
        />
      </div>

      <header className="u-container mt-6 grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:items-start">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="aspect-[3/4] overflow-hidden rounded-xl bg-paper-deep">
            <img
              src={work.cover}
              alt=""
              className="h-full w-full object-contain p-3"
              decoding="async"
            />
          </div>
        </div>

        <div>
          {collectionCard}
          <h1 className="u-display mt-3 text-3xl leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            {work.description[locale]}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="u-eyebrow">{strings.author}</dt>
              <dd className="mt-1">{authorCard}</dd>
            </div>
            <div>
              <dt className="u-eyebrow">{strings.published}</dt>
              <dd className="mt-1">
                <time dateTime={work.date}>{formatDate(work.date, locale)}</time>
              </dd>
            </div>
            <div>
              <dt className="u-eyebrow">{strings.readingTimeLabel}</dt>
              <dd className="mt-1">{strings.readingTime(work.readingMinutes[locale])}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <ShareButtons
              url={absoluteUrl(workPath(work, locale))}
              title={title}
              locale={locale}
            />
          </div>
        </div>
      </header>

      {notice ? (
        <div className="u-container mt-10">
          <p className="rounded-xl border border-shell/30 bg-shell-soft/40 px-4 py-3 text-sm text-ink">
            {notice}
          </p>
        </div>
      ) : null}

      <section className="u-container mt-12" aria-label={title}>
        <Markdown className="work-body" lang={bodyLang}>
          {work.body[locale]}
        </Markdown>
      </section>

      <div className="u-container mt-16 space-y-16">
        {related.length > 0 ? (
          <section aria-labelledby="related-heading">
            <h2 id="related-heading" className="u-display text-2xl">
              {strings.relatedWorks}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <WorkCard
                  key={item.slug}
                  work={toWorkCardData(item, locale)}
                  locale={locale}
                  linkMode={linkMode}
                />
              ))}
            </div>
          </section>
        ) : null}

        <nav
          aria-label={strings.navWorks}
          className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
        >
          {newer ? (
            linkMode === 'next' ? (
              <Link
                href={workHref(locale, newer)}
                className="u-focus rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-shell"
              >
                <span className="u-eyebrow">← {strings.newerWork}</span>
                <span className="u-display mt-2 block text-lg">{newer.title[locale]}</span>
              </Link>
            ) : (
              <a
                href={workHref(locale, newer)}
                className="u-focus rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-shell"
              >
                <span className="u-eyebrow">← {strings.newerWork}</span>
                <span className="u-display mt-2 block text-lg">{newer.title[locale]}</span>
              </a>
            )
          ) : (
            <span aria-hidden="true" />
          )}
          {older ? (
            linkMode === 'next' ? (
              <Link
                href={workHref(locale, older)}
                className="u-focus rounded-2xl border border-line bg-surface p-5 text-right transition-colors hover:border-shell"
              >
                <span className="u-eyebrow">{strings.olderWork} →</span>
                <span className="u-display mt-2 block text-lg">{older.title[locale]}</span>
              </Link>
            ) : (
              <a
                href={workHref(locale, older)}
                className="u-focus rounded-2xl border border-line bg-surface p-5 text-right transition-colors hover:border-shell"
              >
                <span className="u-eyebrow">{strings.olderWork} →</span>
                <span className="u-display mt-2 block text-lg">{older.title[locale]}</span>
              </a>
            )
          ) : null}
        </nav>

        <NewsletterSection locale={locale} idPrefix="work-newsletter" />
      </div>
    </article>
  )
}
