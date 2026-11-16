import { RssIcon } from '@/components/icons'
import { feedHref, ui, type Locale } from '@/lib/i18n'
import { FACEBOOK_URL, SOURCE_URL } from '@/lib/site'

type Props = {
  locale: Locale
}

export function SiteFooter({ locale }: Props) {
  const strings = ui[locale]
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-line bg-paper-deep/60">
      <div className="u-container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="u-display text-lg font-semibold">
            {locale === 'zh' ? '郭瀞婷寫作' : 'Tina Kuo Books'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {strings.footerLicense}
          </p>
        </div>

        <div className="text-sm text-ink-muted">
          <p>
            © {year} {locale === 'zh' ? '郭瀞婷寫作 Tina Kuo Books' : 'Tina Kuo Books'}
          </p>
          <p className="mt-1">{strings.footerRights}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="u-focus w-fit text-ink-muted transition-colors hover:text-shell"
          >
            {strings.footerFacebook}
          </a>
          <a
            href={feedHref(locale)}
            className="u-focus inline-flex w-fit items-center gap-2 text-ink-muted transition-colors hover:text-shell"
          >
            <RssIcon className="h-4 w-4" />
            {strings.footerRss}
          </a>
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="u-focus w-fit text-ink-muted transition-colors hover:text-shell"
          >
            {strings.footerSource}
          </a>
        </div>

        <p className="text-sm text-ink-muted">{strings.footerBuiltWith}</p>
      </div>
    </footer>
  )
}
