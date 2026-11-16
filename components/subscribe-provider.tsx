'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CloseIcon } from '@/components/icons'
import { NewsletterForm } from '@/components/newsletter-form'
import { ui, type Locale } from '@/lib/i18n'

type SubscribeContextValue = {
  openSubscribe: () => void
}

const SubscribeContext = createContext<SubscribeContextValue | null>(null)

export function useSubscribe(): SubscribeContextValue {
  const context = useContext(SubscribeContext)
  if (!context) throw new Error('useSubscribe must be used inside SubscribeProvider')
  return context
}

type ProviderProps = {
  locale: Locale
  children: ReactNode
}

export function SubscribeProvider({ locale, children }: ProviderProps) {
  const strings = ui[locale]
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  const openSubscribe = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    dialog.showModal()
    setOpen(true)
  }, [])

  const closeSubscribe = useCallback(() => {
    const dialog = dialogRef.current
    if (!dialog || !dialog.open) return
    dialog.close()
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <SubscribeContext.Provider value={{ openSubscribe }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="subscribe-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeSubscribe()
        }}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-xl backdrop:bg-ink/40"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={closeSubscribe}
            aria-label={strings.close}
            className="u-focus absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted hover:text-shell"
          >
            <CloseIcon />
          </button>

          <h2 id="subscribe-title" className="u-display pr-10 text-2xl">
            {strings.subscribeTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {strings.subscribeDescription}
          </p>

          <div className="mt-6">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </dialog>
    </SubscribeContext.Provider>
  )
}

type ButtonProps = {
  locale: Locale
  className?: string
  label?: string
}

export function SubscribeButton({ locale, className, label }: ButtonProps) {
  const { openSubscribe } = useSubscribe()
  return (
    <button type="button" onClick={openSubscribe} className={className ?? 'u-focus'}>
      {label ?? ui[locale].subscribe}
    </button>
  )
}
