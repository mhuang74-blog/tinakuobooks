import './globals.css'
import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { NotFoundContent } from '@/components/not-found-content'
import { SiteScripts } from '@/components/site-scripts'
import { SiteShell } from '@/components/site-shell'

const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-fraunces' })
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="zh-Hant" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <SiteShell locale="zh">
          <NotFoundContent />
        </SiteShell>
        <SiteScripts />
      </body>
    </html>
  )
}
