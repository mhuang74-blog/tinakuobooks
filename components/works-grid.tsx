import { WorkCard } from '@/components/work-card'
import type { Locale } from '@/lib/i18n'
import type { Work } from '@/lib/works'
import { toWorkCardData } from '@/lib/work-card'

type Props = {
  works: Work[]
  locale: Locale
  linkMode: 'legacy' | 'next'
  emptyMessage?: string
}

export function WorksGrid({ works, locale, linkMode, emptyMessage }: Props) {
  if (works.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
        {emptyMessage ?? '—'}
      </p>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {works.map((work) => (
        <WorkCard
          key={work.slug}
          work={toWorkCardData(work, locale)}
          locale={locale}
          linkMode={linkMode}
        />
      ))}
    </div>
  )
}
