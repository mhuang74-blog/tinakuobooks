import Link from 'next/link'

export type Crumb = {
  label: string
  href?: string
  legacy?: boolean
}

type Props = {
  items: Crumb[]
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isCurrent ? (
                item.legacy ? (
                  <a href={item.href} className="u-focus hover:text-shell">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="u-focus hover:text-shell">
                    {item.label}
                  </Link>
                )
              ) : (
                <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>
              )}
              {!isCurrent ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
