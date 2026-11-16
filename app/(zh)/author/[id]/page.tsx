import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { WorksGrid } from '@/components/works-grid'
import { authors, getAuthor, isAuthorId } from '@/content/authors'
import { getWorksByAuthor } from '@/lib/works'
import { authorJsonLd, breadcrumbJsonLd, buildMetadata } from '@/lib/seo'
import { authorHref, homeHref, ui } from '@/lib/i18n'
import { FACEBOOK_URL } from '@/lib/site'

export const dynamicParams = false

const strings = ui.zh

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
    locale: 'zh',
    title: author.name.zh,
    description: author.bio.zh,
    path: authorHref('zh', id),
    alternates: {
      zh: authorHref('zh', id),
      en: authorHref('en', id),
      xDefault: authorHref('zh', id),
    },
    image: { url: '/og/home.jpg', alt: author.name.zh },
    keywords: [author.name.zh, '郭瀞婷', 'Tina Kuo'],
  })
}

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  if (!isAuthorId(id)) notFound()

  const author = getAuthor(id)
  const works = getWorksByAuthor(id)

  return (
    <div className="u-container pt-8">
      <JsonLd data={authorJsonLd(author, works, 'zh')} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: strings.home, path: '/' },
          { name: strings.navWorks, path: '/works' },
          { name: author.name.zh, path: authorHref('zh', id) },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: strings.home, href: homeHref('zh'), legacy: true },
          { label: strings.navWorks, href: '/works', legacy: false },
          { label: author.name.zh },
        ]}
      />

      <header className="mt-8 grid gap-8 md:grid-cols-[12rem_1fr] md:items-start">
        <img
          src={author.picture}
          alt={author.name.zh}
          className="w-full rounded-2xl border border-line bg-paper-deep object-cover"
        />
        <div>
          <h1 className="u-display text-4xl">{author.name.zh}</h1>
          <p className="mt-2 text-sm text-ink-muted">{author.location.zh}</p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            {author.bio.zh}
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
              href={`${authorHref('zh', id)}feed.xml`}
              className="u-focus text-shell hover:underline"
            >
              RSS
            </a>
          </p>
          <p className="mt-2 text-xs text-ink-muted">{strings.workCount(works.length)}</p>
        </div>
      </header>

      <div className="mt-10">
        <WorksGrid works={works} locale="zh" linkMode="legacy" emptyMessage="目前還沒有作品。" />
      </div>
    </div>
  )
}
