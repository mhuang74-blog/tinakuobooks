import Link from 'next/link'
import { homeHref, ui, worksHref, type Locale } from '@/lib/i18n'

type Props = { locale?: Locale }

export function NotFoundContent({ locale = 'zh' }: Props) {
  const strings = ui[locale]
  const switchLocale: Locale = locale === 'en' ? 'zh' : 'en'

  return (
    <div
      data-custom-404
      className="u-container flex min-h-[60vh] flex-col justify-center py-16"
    >
      <p className="u-display text-7xl text-shell">404</p>
      <h1 className="u-display mt-4 text-3xl">{strings.notFoundTitle}</h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
        {strings.notFoundBody}
      </p>
      <p className="mt-1 max-w-xl text-sm text-ink-muted">
        Page not found. 這個頁面不存在。
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={homeHref(locale)}
          className="u-focus inline-flex h-11 items-center rounded-full bg-shell px-5 text-sm font-medium text-white transition-colors hover:bg-ink"
        >
          {strings.backHome}
        </a>
        <Link
          href={worksHref(locale)}
          className="u-focus inline-flex h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors hover:border-shell hover:text-shell"
        >
          {strings.browseWorks}
        </Link>
        <a
          href={homeHref(switchLocale)}
          hrefLang={switchLocale}
          className="u-focus inline-flex h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors hover:border-shell hover:text-shell"
        >
          {switchLocale === 'en' ? 'English' : '中文'}
        </a>
        <Link
          href={worksHref(switchLocale)}
          hrefLang={switchLocale}
          className="u-focus inline-flex h-11 items-center rounded-full border border-line bg-surface px-5 text-sm font-medium text-ink transition-colors hover:border-shell hover:text-shell"
        >
          {switchLocale === 'en' ? 'English works' : '中文作品'}
        </Link>
      </div>
    </div>
  )
}
