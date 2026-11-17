import type { Metadata } from 'next'
import Link from 'next/link'
import { ui } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'

const strings = ui.zh

export const metadata: Metadata = {
  ...buildMetadata({
    locale: 'zh',
    title: '404',
    description: strings.notFoundBody,
    path: '/404',
    noindex: true,
  }),
  robots: { index: false, follow: false },
}

export default function NotFoundPage() {
  return (
    <div data-custom-404 className="wrap not-found">
      <p className="not-found-code">404</p>
      <h1 className="page-title">{strings.notFoundTitle}</h1>
      <p className="page-lead">{strings.notFoundBody}</p>
      <p className="page-meta">Page not found. 這個頁面不存在。</p>

      <div className="page-cta">
        <a className="btn btn-primary" href="/">
          {strings.backHome}
        </a>
        <Link className="btn btn-ghost" href="/works">
          {strings.browseWorks}
        </Link>
        <a className="btn btn-ghost" href="/en" hrefLang="en">
          English
        </a>
        <Link className="btn btn-ghost" href="/en/works" hrefLang="en">
          English works
        </Link>
      </div>
    </div>
  )
}
