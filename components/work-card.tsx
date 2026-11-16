import Link from 'next/link'
import { formatDate, ui, type Locale } from '@/lib/i18n'
import type { WorkCardData } from '@/lib/work-card'

type Props = {
  work: WorkCardData
  locale: Locale
  linkMode: 'legacy' | 'next'
}

export function WorkCard({ work, locale, linkMode }: Props) {
  const strings = ui[locale]

  const body = (
    <>
      <div className="overflow-hidden rounded-xl bg-paper-deep">
        <img
          src={work.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-3 transition-transform duration-500 motion-reduce:transform-none group-hover:scale-[1.02]"
        />
      </div>

      <div className="min-w-0">
        <p
          className="u-eyebrow"
          style={{ color: work.collectionAccent }}
        >
          {work.collectionName}
        </p>
        <h3 className="u-display mt-2 text-xl leading-snug">{work.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {work.description}
        </p>
        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span>{work.authorName}</span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(work.date, locale)}</span>
          <span aria-hidden="true">·</span>
          <span>{strings.readingTime(work.readingMinutes)}</span>
        </p>
      </div>
    </>
  )

  const className =
    'group grid h-full gap-5 rounded-2xl border border-line bg-surface p-4 transition-all hover:-translate-y-1 hover:border-shell/40 hover:shadow-lg motion-reduce:hover:translate-y-0'

  return (
    <article className="h-full [&>a]:md:grid-cols-[8rem_1fr]">
      {linkMode === 'next' ? (
        <Link href={work.href} className={className}>
          {body}
        </Link>
      ) : (
        <a href={work.href} className={className}>
          {body}
        </a>
      )}
    </article>
  )
}
