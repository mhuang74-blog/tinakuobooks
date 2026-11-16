import type { Metadata } from 'next'
import { Suspense } from 'react'
import { WorksExplorer } from '@/components/works-explorer'
import { WorksGridSkeleton } from '@/components/works-grid-skeleton'
import { collections } from '@/content/collections'
import { getTranslatedWorks } from '@/lib/works'
import { buildMetadata } from '@/lib/seo'
import { ui } from '@/lib/i18n'
import { toWorkCardData } from '@/lib/work-card'

const strings = ui.en

export const metadata: Metadata = buildMetadata({
  locale: 'en',
  title: 'Works',
  description:
    'Search and filter every book, picture book, and stage story written by Tina Kuo.',
  path: '/en/works',
  alternates: { zh: '/works', en: '/en/works', xDefault: '/works' },
})

export default function EnWorksPage() {
  const works = getTranslatedWorks()

  return (
    <div className="u-container pt-12">
      <header className="max-w-2xl">
        <p className="u-eyebrow">{strings.worksKicker}</p>
        <h1 className="u-display mt-3 text-4xl">{strings.navWorks}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          From slapstick school diaries to young adult novels, picture books, and
          stage adaptations — every work by Tina Kuo in one place.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<WorksGridSkeleton />}>
          <WorksExplorer
            works={works.map((work) => toWorkCardData(work, 'en'))}
            collections={collections.map((collection) => ({
              id: collection.id,
              name: collection.name.en,
              count: works.filter((work) => work.collectionId === collection.id).length,
            }))}
            locale="en"
            linkMode="next"
          />
        </Suspense>
      </div>
    </div>
  )
}
