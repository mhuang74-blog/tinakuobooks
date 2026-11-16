import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { WorksGrid } from '@/components/works-grid'
import { collections, isCollectionId } from '@/content/collections'
import { getWorksByCollection } from '@/lib/works'
import { breadcrumbJsonLd, buildMetadata, collectionJsonLd } from '@/lib/seo'
import { collectionHref, homeHref, ui, worksHref } from '@/lib/i18n'
import { getCollection } from '@/content/collections'

export const dynamicParams = false

const strings = ui.zh

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return collections.map((collection) => ({ slug: collection.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  if (!isCollectionId(slug)) return {}
  const collection = getCollection(slug)

  return buildMetadata({
    locale: 'zh',
    title: collection.name.zh,
    description: `${collection.name.zh}｜${collection.description.zh}｜郭瀞婷作品`,
    path: collectionHref('zh', slug),
    alternates: {
      zh: collectionHref('zh', slug),
      en: collectionHref('en', slug),
      xDefault: collectionHref('zh', slug),
    },
    image: { url: '/og/home.jpg', alt: collection.name.zh },
    keywords: [collection.name.zh, '郭瀞婷', 'Tina Kuo'],
  })
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  if (!isCollectionId(slug)) notFound()

  const collection = getCollection(slug)
  const works = getWorksByCollection(slug)

  return (
    <div className="u-container pt-8">
      <JsonLd data={collectionJsonLd(collection, works, 'zh')} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: strings.home, path: '/' },
          { name: strings.navCollections, path: '/collections' },
          { name: collection.name.zh, path: collectionHref('zh', slug) },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: strings.home, href: homeHref('zh'), legacy: true },
          { label: strings.navCollections, href: '/collections', legacy: false },
          { label: collection.name.zh },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <span
          aria-hidden="true"
          className="block h-1 w-16 rounded-full"
          style={{ backgroundColor: collection.accent }}
        />
        <h1 className="u-display mt-4 text-4xl">{collection.name.zh}</h1>
        <p className="mt-3 text-lg text-ink-muted">{collection.description.zh}</p>
        <p className="mt-2 text-sm text-ink-muted">{strings.workCount(works.length)}</p>
      </header>

      <div className="mt-10">
        <WorksGrid works={works} locale="zh" linkMode="legacy" emptyMessage="這個主題還沒有作品。" />
      </div>

      <p className="mt-12">
        <a
          href={worksHref('zh')}
          className="u-focus text-sm font-medium text-shell hover:underline"
        >
          ← {strings.allWorks}
        </a>
      </p>
    </div>
  )
}
