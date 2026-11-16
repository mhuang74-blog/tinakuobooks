import Link from 'next/link'
import { ui, type Locale } from '@/lib/i18n'
import { getCollection, type CollectionId } from '@/content/collections'

type Props = {
  id: CollectionId
  locale: Locale
  count: number
  href: string
  linkMode: 'legacy' | 'next'
}

export function CollectionCard({ id, locale, count, href, linkMode }: Props) {
  const collection = getCollection(id)
  const strings = ui[locale]

  const body = (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: collection.accent }}
      />
      <div className="flex items-start justify-between gap-4 pt-2">
        <div>
          <h3 className="u-display text-xl">{collection.name[locale]}</h3>
          <p className="mt-1 text-sm text-ink-muted">{collection.description[locale]}</p>
        </div>
        <p className="shrink-0 text-xs text-ink-muted">{strings.workCount(count)}</p>
      </div>
      <div className="mt-5 overflow-hidden rounded-xl bg-paper-deep">
        <img
          src={collection.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-32 w-full object-cover transition-transform duration-500 motion-reduce:transform-none group-hover:scale-[1.03]"
        />
      </div>
    </>
  )

  const className =
    'group relative block overflow-hidden rounded-2xl border border-line bg-surface p-5 pt-6 transition-all hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0'

  return linkMode === 'next' ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <a href={href} className={className}>
      {body}
    </a>
  )
}
