import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { SubscribeProvider } from '@/components/subscribe-provider'
import { ui, type Locale } from '@/lib/i18n'
import { getAllWorks } from '@/lib/works'

type Props = {
  locale: Locale
  children: ReactNode
}

export function SiteShell({ locale, children }: Props) {
  const pairs = getAllWorks().map((work) => ({
    slug: work.slug,
    slugEn: work.slugEn,
  }))

  return (
    <SubscribeProvider locale={locale}>
      <a
        href="#main"
        className="u-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        {ui[locale].skipToContent}
      </a>
      <SiteHeader locale={locale} pairs={pairs} />
      <main id="main">{children}</main>
      <SiteFooter locale={locale} />
    </SubscribeProvider>
  )
}
