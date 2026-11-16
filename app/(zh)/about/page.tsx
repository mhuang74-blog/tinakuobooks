import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { aboutParagraphs } from '@/content/about'
import { authors } from '@/content/authors'
import { buildMetadata } from '@/lib/seo'
import { homeHref, ui, worksHref } from '@/lib/i18n'
import { FACEBOOK_URL } from '@/lib/site'

const strings = ui.zh

export const metadata: Metadata = buildMetadata({
  locale: 'zh',
  title: '關於',
  description:
    '這是一個由 Michael S. Huang 建立的網站，收集郭瀞婷的作品，也用他的方式把故事延伸出去。',
  path: '/about/',
  alternates: { zh: '/about/', en: '/en/about', xDefault: '/about/' },
})

export default function AboutPage() {
  return (
    <div className="u-container pt-8">
      <Breadcrumbs
        items={[
          { label: strings.home, href: homeHref('zh'), legacy: true },
          { label: strings.navAbout },
        ]}
      />

      <header className="mt-8 max-w-3xl">
        <p className="u-eyebrow">{strings.aboutKicker}</p>
        <h1 className="u-display mt-3 text-4xl">{strings.navAbout}</h1>
        <p className="mt-6 text-xl leading-relaxed">{aboutParagraphs.zh[0]}</p>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {aboutParagraphs.en[0]}
        </p>
      </header>

      <section className="mt-14" aria-labelledby="authors-heading">
        <h2 id="authors-heading" className="u-display text-2xl">
          作者
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {authors.map((author) => (
            <article
              key={author.id}
              className="flex gap-4 rounded-2xl border border-line bg-surface p-5"
            >
              <img
                src={author.picture}
                alt={author.name.zh}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div>
                <h3 className="u-display text-lg">{author.name.zh}</h3>
                <p className="mt-1 text-xs text-ink-muted">{author.location.zh}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {author.bio.zh}
                </p>
                {author.facebook ? (
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-focus mt-2 inline-block text-xs text-shell hover:underline"
                  >
                    Facebook
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <p className="mt-12">
        <a
          href={worksHref('zh')}
          className="u-focus inline-flex h-11 items-center rounded-full bg-shell px-5 text-sm font-medium text-white transition-colors hover:bg-ink"
        >
          {strings.exploreWorks}
        </a>
      </p>
    </div>
  )
}
