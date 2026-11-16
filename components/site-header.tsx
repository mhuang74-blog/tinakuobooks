'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CloseIcon, MenuIcon } from '@/components/icons'
import {
  LanguageToggle,
  type WorkPair,
} from '@/components/language-toggle'
import { SubscribeButton } from '@/components/subscribe-provider'
import {
  aboutHref,
  collectionsHref,
  homeHref,
  ui,
  worksHref,
  type Locale,
} from '@/lib/i18n'

type Props = {
  locale: Locale
  pairs: WorkPair[]
}

function activeKey(pathname: string, locale: Locale, pairs: WorkPair[]) {
  let decoded = pathname
  try {
    decoded = decodeURIComponent(pathname)
  } catch {
    // keep the raw value when the segment is malformed
  }
  const path = decoded.length > 1 ? decoded.replace(/\/+$/, '') : decoded

  if (locale === 'zh') {
    if (path === '/works' || pairs.some((pair) => path === `/${pair.slug}`)) {
      return 'works'
    }
    if (path === '/collections' || /^\/tag\/[^/]+$/.test(path)) return 'collections'
    if (path === '/about') return 'about'
    return null
  }

  if (path === '/en/works' || /^\/en\/works\/[^/]+$/.test(path)) return 'works'
  if (path === '/en/collections' || /^\/en\/collections\/[^/]+$/.test(path)) {
    return 'collections'
  }
  if (path === '/en/about') return 'about'
  return null
}

export function SiteHeader({ locale, pairs }: Props) {
  const pathname = usePathname() ?? '/'
  const strings = ui[locale]
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const active = activeKey(pathname, locale, pairs)

  const items = [
    {
      key: 'works' as const,
      label: strings.navWorks,
      href: worksHref(locale),
      legacy: false,
    },
    {
      key: 'collections' as const,
      label: strings.navCollections,
      href: collectionsHref(locale),
      legacy: false,
    },
    {
      key: 'about' as const,
      label: strings.navAbout,
      href: aboutHref(locale),
      legacy: locale === 'zh',
    },
  ]

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)

      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && (activeElement === first || !panel.contains(activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (activeElement === last || !panel.contains(activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
      <div className="u-container flex h-16 items-center justify-between gap-4">
        <a
          href={homeHref(locale)}
          className="u-focus flex items-center gap-3 rounded-full"
        >
          <img
            src="/images/turtle-brown-02.png"
            alt=""
            width={38}
            height={38}
            className="h-9 w-9 rounded-full bg-paper-deep object-contain p-1"
          />
          <span className="u-display text-base font-semibold tracking-tight sm:text-lg">
            {locale === 'zh' ? '郭瀞婷寫作' : 'Tina Kuo Books'}
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const className =
              'u-focus rounded-full px-4 py-2 text-sm transition-colors hover:bg-paper-deep' +
              (active === item.key ? ' font-semibold text-shell' : ' text-ink-muted')
            const ariaCurrent = active === item.key ? 'page' : undefined

            return item.legacy ? (
              <a
                key={item.key}
                href={item.href}
                aria-current={ariaCurrent}
                className={className}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={ariaCurrent}
                className={className}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle locale={locale} pairs={pairs} />
          <SubscribeButton
            locale={locale}
            className="hidden h-9 items-center rounded-full bg-shell px-4 text-xs font-medium tracking-[0.1em] text-white transition-colors hover:bg-ink sm:inline-flex"
          />
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={strings.openMenu}
            className="u-focus inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink md:hidden"
          >
            <MenuIcon />
          </button>
        </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={strings.menu}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col bg-paper md:hidden"
          >
            <div className="u-container flex h-16 items-center justify-between">
              <span className="u-display text-lg font-semibold">
                {locale === 'zh' ? '郭瀞婷寫作' : 'Tina Kuo Books'}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={strings.closeMenu}
                className="u-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
              >
                <CloseIcon />
              </button>
            </div>

            <nav
              aria-label="Main"
              className="u-container flex flex-1 flex-col gap-2 pt-6"
            >
              {items.map((item) =>
                item.legacy ? (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={close}
                    aria-current={active === item.key ? 'page' : undefined}
                    className="u-display border-b border-line py-4 text-3xl"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={close}
                    aria-current={active === item.key ? 'page' : undefined}
                    className="u-display border-b border-line py-4 text-3xl"
                  >
                    {item.label}
                  </Link>
                ),
              )}

              <div className="mt-8 flex items-center gap-3">
                <LanguageToggle locale={locale} pairs={pairs} />
                <SubscribeButton
                  locale={locale}
                  className="inline-flex h-9 items-center rounded-full bg-shell px-4 text-xs font-medium tracking-[0.1em] text-white"
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
