import { NewsletterForm } from '@/components/newsletter-form'
import { ui, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
  idPrefix: string
}

export function NewsletterSection({ locale, idPrefix }: Props) {
  const strings = ui[locale]

  return (
    <section
      aria-labelledby={`${idPrefix}-heading`}
      className="rounded-3xl border border-line bg-paper-deep/70 p-6 sm:p-10"
    >
      <div className="grid min-w-0 gap-8 md:grid-cols-[1.1fr_1fr] md:items-start">
        <div className="min-w-0">
          <p className="u-eyebrow">{strings.subscribe}</p>
          <h2 id={`${idPrefix}-heading`} className="u-display mt-2 text-2xl">
            {strings.newsletterTitle}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
            {strings.newsletterBody}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-line bg-surface p-5">
          <NewsletterForm locale={locale} idPrefix={idPrefix} />
        </div>
      </div>
    </section>
  )
}
