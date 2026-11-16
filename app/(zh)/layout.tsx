import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Inter } from 'next/font/google'
import { SiteScripts } from '@/components/site-scripts'
import { SiteShell } from '@/components/site-shell'
import {
  SITE_DESCRIPTION_ZH,
  SITE_KEYWORDS,
  SITE_TITLE_ZH,
  SITE_URL,
} from '@/lib/site'
import '../globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_ZH,
    template: `%s | ${SITE_TITLE_ZH}`,
  },
  description: SITE_DESCRIPTION_ZH,
  keywords: SITE_KEYWORDS,
  alternates: {
    types: {
      'application/atom+xml': '/feed.xml',
      'application/rss+xml': '/atom.xml',
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_TITLE_ZH,
    locale: 'zh_TW',
    title: SITE_TITLE_ZH,
    description: SITE_DESCRIPTION_ZH,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630 }],
  },
}

export default function ZhRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <SiteShell locale="zh">{children}</SiteShell>
        <SiteScripts />
      </body>
    </html>
  )
}
