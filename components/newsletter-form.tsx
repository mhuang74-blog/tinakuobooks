import { MAILCHIMP_ACTION, MAILCHIMP_HONEYPOT } from '@/lib/site'
import { ui, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
  idPrefix?: string
}

export function NewsletterForm({ locale, idPrefix = 'subscribe' }: Props) {
  const strings = ui[locale]
  const emailId = `${idPrefix}-email`
  const nameId = `${idPrefix}-name`

  return (
    <form
      action={MAILCHIMP_ACTION}
      method="post"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-sm font-medium">
          {strings.subscribeEmail}
        </label>
        <input
          id={emailId}
          type="email"
          name="EMAIL"
          required
          autoComplete="email"
          className="h-11 w-full min-w-0 rounded-lg border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-muted/60"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={nameId} className="text-sm font-medium">
          {strings.subscribeName}
        </label>
        <input
          id={nameId}
          type="text"
          name="CH_NAME"
          required
          autoComplete="nickname"
          className="h-11 w-full min-w-0 rounded-lg border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink-muted/60"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute -left-[5000px] h-0 w-0 overflow-hidden"
      >
        <input
          type="text"
          name={MAILCHIMP_HONEYPOT}
          tabIndex={-1}
          defaultValue=""
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        name="subscribe"
        className="u-focus inline-flex h-11 items-center justify-center rounded-full bg-shell px-6 text-sm font-medium tracking-[0.08em] text-white transition-colors hover:bg-ink"
      >
        {strings.subscribeSubmit}
      </button>
    </form>
  )
}
