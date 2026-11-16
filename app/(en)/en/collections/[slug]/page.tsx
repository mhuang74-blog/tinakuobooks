import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { JsonLd } from '@/components/json-ld'
import { WorksGrid } from '@/components/works-grid'
import { collections, getCollection, isCollectionId } from '@/content/collections'
import { getTranslatedWorks } from '@/lib/works'
import { breadcrumbJsonLd, buildMetadata, collectionJsonLd } from '@/lib/seo'
import { collectionHref, ui } from '@/lib/i18n'

export const dynamicParams = false

const strings = ui.en

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
    locale: 'en',
    title: collection.name.en,
    description: `${collection.name.en} — ${collection.description.en}. Works by Tina Kuo.`,
    path: collectionHref('en', slug),
    alternates: {
      zh: collectionHref('zh', slug),
      en: collectionHref('en', slug),
      xDefault: collectionHref('zh', slug),
    },
    image: { url: '/og/home.jpg', alt: collection.name.en },
    keywords: [collection.name.en, 'Tina Kuo'],
  })
}

export default async function EnCollectionPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  if (!isCollectionId(slug)) notFound()

  const collection = getCollection(slug)
  const works = getTranslatedWorks().filter((work) => work.collectionId === slug)

  return (
    <div className="u-container pt-8">
      <JsonLd data={collectionJsonLd(collection, works, 'en')} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: strings.home, path: '/en' },
          { name: strings.navCollections, path: '/en/collections' },
          { name: collection.name.en, path: collectionHref('en', slug) },
        ])}
      />

      <Breadcrumbs
        items={[
          { label: strings.home, href: '/en' },
          { label: strings.navCollections, href: '/en/collections' },
          { label: collection.name.en },
        ]}
      />

      <header className="mt-8 max-w-2xl">
        <span
          aria-hidden="true"
          className="block h-1 w-16 rounded-full"
          style={{ backgroundColor: collection.accent }}
        />
        <h1 className="u-display mt-4 text-4xl">{collection.name.en}</h1>
        <p className="mt-3 text-lg text-ink-muted">{collection.description.en}</p>
        <p className="mt-2 text-sm text-ink-muted">{strings.workCount(works.length)}</p>
      </header>

      <div className="mt-10">
        <WorksGrid
          works={works}
          locale="en"
          linkMode="next"
          emptyMessage="No works in this collection yet."
        />
      </div>

      <p className="mt-12">
        <Link
          href="/en/works"
          className="u-focus text-sm font-medium text-shell hover:underline"
        >
          ← {strings.allWorks}
        </Link>
      </p>
    </div>
  )
}
