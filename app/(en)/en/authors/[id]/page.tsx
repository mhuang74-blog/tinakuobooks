import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { WorksGrid } from '@/components/works-grid'
import { authors, getAuthor, isAuthorId } from '@/content/authors'
import { getTranslatedWorks } from '@/lib/works'
import { authorJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { authorHref, ui } from '@/lib/i18n'
import { FACEBOOK_URL } from '@/lib/site'

export const dynamicParams = false

const strings = ui.en

type Params = { id: string }

export function generateStaticParams(): Params[] {
  return authors.map((author) => ({ id: author.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { id } = await params
  if (!isAuthorId(id)) return {}
  const author = getAuthor(id)

  return buildMetadata({
    locale: 'en',
    title: author.name.en,
    description: author.bio.en,
    path: authorHref('en', id),
    alternates: {
      zh: authorHref('zh', id),
      en: authorHref('en', id),
      xDefault: authorHref('zh', id),
    },
    image: { url: '/og/home.jpg', alt: author.name.en },
    keywords: [author.name.en, 'Tina Kuo'],
  })
}

export default async function EnAuthorPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { id } = await params
  if (!isAuthorId(id)) notFound()

  const author = getAuthor(id)
  const works = getTranslatedWorks().filter((work) => work.authorId === id)

  return (
    <div className="u-container pt-8">
      <JsonLd data={authorJsonLd(author, works, 'en')} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: strings.home, path: '/en' },
          { name: strings.navWorks, path: '/en/works' },
          { name: author.name.en, path: authorHref('en', id) },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: strings.home, href: '/en' },
          { label: strings.navWorks, href: '/en/works' },
          { label: author.name.en },
        ]}
      />

      <header className="mt-8 grid gap-8 md:grid-cols-[12rem_1fr] md:items-start">
        <img
          src={author.picture}
          alt={author.name.en}
          className="w-full rounded-2xl border border-line bg-paper-deep object-cover"
        />
        <div>
          <h1 className="u-display text-4xl">{author.name.en}</h1>
          <p className="mt-2 text-sm text-ink-muted">{author.location.en}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            {author.bio.en}
          </p>
          <p className="mt-4 flex flex-wrap gap-4 text-sm">
            {author.facebook ? (
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="u-focus text-shell hover:underline"
              >
                Facebook
              </a>
            ) : null}
            <a
              href={`${authorHref('en', id)}/feed.xml`}
              className="u-focus text-shell hover:underline"
            >
              RSS
            </a>
          </p>
          <p className="mt-2 text-xs text-ink-muted">{strings.workCount(works.length)}</p>
        </div>
      </header>

      <div className="mt-10">
        <WorksGrid
          works={works}
          locale="en"
          linkMode="next"
          emptyMessage="No works yet."
        />
      </div>

      <p className="mt-12">
        <Link
          href="/en/collections"
          className="u-focus text-sm font-medium text-shell hover:underline"
        >
          {strings.allCollections}
        </Link>
      </p>
    </div>
  )
}
