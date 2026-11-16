import type { Metadata } from 'next'
import { CollectionCard } from '@/components/collection-card'
import { collections } from '@/content/collections'
import { getTranslatedWorks } from '@/lib/works'
import { buildMetadata } from '@/lib/seo'
import { ui } from '@/lib/i18n'

const strings = ui.en

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  title: 'Collections',
  description:
    'Browse Tina Kuo works by collection: funny fiction, young adult fiction, picture books, stage performance, and story continuations.',
  path: '/en/collections',
  alternates: {
    zh: '/collections',
    en: '/en/collections',
    xDefault: '/collections',
  },
})

export default function EnCollectionsPage() {
  const works = getTranslatedWorks()

  return (
    <div className="u-container pt-12">
      <header className="max-w-2xl">
        <p className="u-eyebrow">{strings.collectionsKicker}</p>
        <h1 className="u-display mt-3 text-4xl">{strings.navCollections}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Five collections, five ways to read. Pick one and let the story continue.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            id={collection.id}
            locale="en"
            count={works.filter((work) => work.collectionId === collection.id).length}
            href={`/en/collections/${collection.id}`}
            linkMode="next"
          />
        ))}
      </div>
    </div>
  )
}
