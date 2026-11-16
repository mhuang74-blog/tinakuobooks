import Link from 'next/link'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  link?: { href: string; label: string; legacy?: boolean }
}

export function SectionHeading({ eyebrow, title, description, link }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? <p className="u-eyebrow">{eyebrow}</p> : null}
        <h2 className="u-display mt-2 text-2xl sm:text-3xl">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {link ? (
        link.legacy ? (
          <a
            href={link.href}
            className="u-focus inline-flex items-center gap-2 text-sm font-medium text-shell hover:underline"
          >
            {link.label}
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <Link
            href={link.href}
            className="u-focus inline-flex items-center gap-2 text-sm font-medium text-shell hover:underline"
          >
            {link.label}
            <span aria-hidden="true">→</span>
          </Link>
        )
      ) : null}
    </div>
  )
}
