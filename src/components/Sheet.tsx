import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cx } from '../cx'
import { IconButton } from './Button'

export interface SheetProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  /** Buttons at the bottom. */
  footer?: ReactNode
  className?: string
}

/**
 * Panel that slides up from the bottom (centred on wide screens). Rendered
 * in place, not in a portal, so it keeps the surrounding theme; Esc or a tap
 * on the backdrop closes it.
 */
export function Sheet({ open, onClose, title, children, footer, className }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const before = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      before?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="bn-sheet">
      <div className="bn-sheet__backdrop" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('bn-sheet__panel', className)}
      >
        <span className="bn-sheet__grip" aria-hidden="true" />
        <header className="bn-sheet__head">
          <h2 id={titleId} className="bn-sheet__title">
            {title}
          </h2>
          <IconButton icon="close" label="Close" onClick={onClose} />
        </header>
        <div className="bn-sheet__body">{children}</div>
        {footer && <footer className="bn-sheet__foot">{footer}</footer>}
      </div>
    </div>
  )
}
