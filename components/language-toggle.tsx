'use client'

import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { ui } from '@/lib/i18n'

export type WorkPair = { slug: string; slugEn: string }

export function pairForPath(
  pathname: string,
  locale: Locale,
  pairs: WorkPair[],
): string | null {
  // usePathname() returns percent-encoded non-ASCII segments; work slugs are
  // authored as raw Chinese filenames.
  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    // keep the raw value when the segment is malformed
  }
  const path = decoded.length > 1 ? decoded.replace(/\/+$/, '') : decoded

  if (locale === 'zh') {
    if (path === '/' || path === '') return '/en'
    if (path === '/works') return '/en/works'
    if (path === '/collections') return '/en/collections'
    if (path === '/about') return '/en/about'
    if (path === '/404') return '/en'

    const tag = path.match(/^\/tag\/([^/]+)$/)
    if (tag) return `/en/collections/${tag[1]}`

    const author = path.match(/^\/author\/([^/]+)$/)
    if (author) return `/en/authors/${author[1]}`

    const slug = path.replace(/^\//, '')
    const pair = pairs.find((candidate) => candidate.slug === slug)
    if (pair?.slugEn) return `/en/works/${pair.slugEn}`
    return null
  }

  if (path === '/en' || path === '') return '/'
  if (path === '/en/works') return '/works'
  if (path === '/en/collections') return '/collections'
  if (path === '/en/about') return '/about/'

  const collection = path.match(/^\/en\/collections\/([^/]+)$/)
  if (collection) return `/tag/${collection[1]}/`

  const author = path.match(/^\/en\/authors\/([^/]+)$/)
  if (author) return `/author/${author[1]}/`

  const work = path.match(/^\/en\/works\/([^/]+)$/)
  if (work) {
    const pair = pairs.find((candidate) => candidate.slugEn === work[1])
    return pair ? `/${pair.slug}` : null
  }

  return null
}

type Props = {
  locale: Locale
  pairs: WorkPair[]
}

export function LanguageToggle({ locale, pairs }: Props) {
  const pathname = usePathname() ?? '/'
  const strings = ui[locale]
  const target = locale === 'zh' ? 'en' : 'zh'
  const counterpart = pairForPath(pathname, locale, pairs)

  if (!counterpart) {
    return (
      <span
        aria-disabled="true"
        title={strings.languageToggleUnavailable}
        className="inline-flex h-9 items-center rounded-full border border-line px-3 text-xs tracking-[0.12em] text-ink-muted/70"
      >
        {target === 'en' ? 'EN' : '中文'}
      </span>
    )
  }

  return (
    <a
      href={counterpart}
      hrefLang={target === 'en' ? 'en' : 'zh-Hant'}
      lang={target === 'en' ? 'en' : 'zh-Hant'}
      aria-label={
        target === 'en' ? strings.languageToggleToEnglish : '切換到中文版'
      }
      className="u-focus inline-flex h-9 items-center rounded-full border border-line px-3 text-xs font-medium tracking-[0.12em] text-ink-muted transition-colors hover:border-shell hover:text-shell"
    >
      {target === 'en' ? 'EN' : '中文'}
    </a>
  )
}
