import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, Inter } from 'next/font/google'
import { SiteScripts } from '@/components/site-scripts'
import { SiteShell } from '@/components/site-shell'
import {
  SITE_DESCRIPTION_EN,
  SITE_KEYWORDS,
  SITE_TITLE_EN,
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
    default: SITE_TITLE_EN,
    template: `%s | ${SITE_TITLE_EN}`,
  },
  description: SITE_DESCRIPTION_EN,
  keywords: SITE_KEYWORDS,
  alternates: {
    types: {
      'application/atom+xml': '/en/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_TITLE_EN,
    locale: 'en_US',
    title: SITE_TITLE_EN,
    description: SITE_DESCRIPTION_EN,
    images: [{ url: '/og/home.jpg', width: 1200, height: 630 }],
  },
}

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <SiteShell locale="en">{children}</SiteShell>
        <SiteScripts />
      </body>
    </html>
  )
}
