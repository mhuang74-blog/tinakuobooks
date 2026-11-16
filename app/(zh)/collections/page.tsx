import type { Metadata } from 'next'
import { CollectionCard } from '@/components/collection-card'
import { collections } from '@/content/collections'
import { getWorksByCollection } from '@/lib/works'
import { buildMetadata } from '@/lib/seo'
import { ui } from '@/lib/i18n'

const strings = ui.zh

export const metadata: Metadata = buildMetadata({
  locale: 'zh',
  title: '主題',
  description: '依主題瀏覽郭瀞婷的作品：愛搞笑、青少、繪本、戲劇與故事延伸。',
  path: '/collections',
  alternates: { zh: '/collections', en: '/en/collections', xDefault: '/collections' },
})

export default function CollectionsPage() {
  return (
    <div className="u-container pt-12">
      <header className="max-w-2xl">
        <p className="u-eyebrow">{strings.collectionsKicker}</p>
        <h1 className="u-display mt-3 text-4xl">{strings.navCollections}</h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          五個主題，五種閱讀的方式。挑一個喜歡的，讓故事繼續延伸。
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
