'use client'

import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { CloseIcon, SearchIcon } from '@/components/icons'
import { WorkCard } from '@/components/work-card'
import type { CollectionId } from '@/content/collections'
import { ui, type Locale } from '@/lib/i18n'
import type { WorkCardData } from '@/lib/work-card'

type SortKey = 'newest' | 'oldest' | 'title'

type CollectionFilter = {
  id: CollectionId
  name: string
  count: number
}

type Props = {
  works: WorkCardData[]
  collections: CollectionFilter[]
  locale: Locale
  linkMode: 'legacy' | 'next'
}

function normalize(value: string, locale: Locale): string {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase(locale === 'zh' ? 'zh-Hant' : 'en')
}

export function WorksExplorer({ works, collections, locale, linkMode }: Props) {
  const strings = ui[locale]
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const reduceMotion = useReducedMotion()

  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [collection, setCollection] = useState<CollectionId | 'all'>(() => {
    const value = searchParams.get('collection')
    return value && collections.some((item) => item.id === value)
      ? (value as CollectionId)
      : 'all'
  })
  const [sort, setSort] = useState<SortKey>(() => {
    const value = searchParams.get('sort')
    return value === 'oldest' || value === 'title' ? value : 'newest'
  })

  const deferredQuery = useDeferredValue(query)
  const localeName = locale === 'zh' ? 'zh-Hant' : 'en'

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (collection !== 'all') params.set('collection', collection)
    if (sort !== 'newest') params.set('sort', sort)
    const search = params.toString()
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }, [query, collection, sort, pathname, router])

  const visible = useMemo(() => {
    const needle = normalize(deferredQuery.trim(), locale)

    const filtered = works.filter((work) => {
      if (collection !== 'all' && work.collectionId !== collection) return false
      if (!needle) return true
      return normalize(
        `${work.title} ${work.description} ${work.collectionName} ${work.authorName}`,
        locale,
      ).includes(needle)
    })

    return filtered.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title, localeName)
      if (sort === 'oldest') {
        return a.date.localeCompare(b.date) || a.title.localeCompare(b.title, localeName)
      }
      return b.date.localeCompare(a.date) || a.title.localeCompare(b.title, localeName)
    })
  }, [works, collection, deferredQuery, sort, locale, localeName])

  function clearFilters() {
    setQuery('')
    setCollection('all')
    setSort('newest')
  }

  const chipClass = (active: boolean) =>
    'u-focus inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ' +
    (active
      ? 'border-shell bg-shell text-white'
      : 'border-line bg-paper text-ink-muted hover:border-shell hover:text-shell')

  return (
    <div>
      <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label htmlFor="works-search" className="text-sm font-medium">
              {strings.searchLabel}
            </label>
            <div className="relative mt-2">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="works-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={strings.searchPlaceholder}
                className="h-11 w-full rounded-full border border-line bg-paper pl-10 pr-10 text-sm text-ink placeholder:text-ink-muted/70"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={strings.clearFilters}
                  className="u-focus absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:text-shell"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="lg:w-48">
            <label htmlFor="works-sort" className="text-sm font-medium">
              {strings.sortLabel}
            </label>
            <select
              id="works-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="mt-2 h-11 w-full rounded-full border border-line bg-paper px-4 text-sm text-ink"
            >
              <option value="newest">{strings.sortNewest}</option>
              <option value="oldest">{strings.sortOldest}</option>
              <option value="title">{strings.sortTitle}</option>
            </select>
          </div>
        </div>

        <div
          role="group"
          aria-label={strings.navCollections}
          className="mt-4 flex gap-2 overflow-x-auto pb-1"
        >
          <button
            type="button"
            aria-pressed={collection === 'all'}
            onClick={() => setCollection('all')}
            className={chipClass(collection === 'all')}
          >
            {strings.filterAll}
          </button>
          {collections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={collection === item.id}
              onClick={() => setCollection(item.id)}
              className={chipClass(collection === item.id)}
            >
              {item.name}
              <span className="text-xs opacity-70">{item.count}</span>
            </button>
          ))}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-sm text-ink-muted">
        {strings.resultCount(visible.length)}
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <h2 className="u-display text-2xl">{strings.emptyTitle}</h2>
          <p className="mt-2 text-sm text-ink-muted">{strings.emptyBody}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="u-focus mt-6 inline-flex h-11 items-center rounded-full bg-shell px-5 text-sm font-medium text-white transition-colors hover:bg-ink"
          >
            {strings.clearFilters}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((work) => (
            <motion.div
              key={work.slug}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            >
              <WorkCard work={work} locale={locale} linkMode={linkMode} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
