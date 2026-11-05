import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cx } from '../cx'
import { IconButton } from './Button'

export interface SheetProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  /** A line under the title. */
  description?: ReactNode
  children: ReactNode
  /** Buttons at the bottom. */
  footer?: ReactNode
  /** Label of the × button. */
  closeLabel?: string
  /** Wider panel on big screens (720 px instead of 560). */
  wide?: boolean
  className?: string
}

/**
 * Panel that slides up from the bottom (centred on wide screens). Rendered
 * in place, not in a portal, so it keeps the surrounding theme; Esc or a tap
 * on the backdrop closes it.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel = 'Close',
  wide,
  className,
}: SheetProps) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()

  // The latest onClose, so a new function on each render doesn't re-run the
  // effect below (that would pull the focus out of a field being typed in).
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })

  useEffect(() => {
    if (!open) return
    const before = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      before?.focus()
    }
  }, [open])

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
        aria-describedby={description ? descId : undefined}
        className={cx('bn-sheet__panel', wide && 'bn-sheet__panel--wide', className)}
      >
        <span className="bn-sheet__grip" aria-hidden="true" />
        <header className="bn-sheet__head">
          <div>
            <h2 id={titleId} className="bn-sheet__title">
              {title}
            </h2>
            {description && (
              <p id={descId} className="bn-sheet__desc">
                {description}
              </p>
            )}
          </div>
          <IconButton icon="close" label={closeLabel} onClick={onClose} />
        </header>
        <div className="bn-sheet__body">{children}</div>
        {footer && <footer className="bn-sheet__foot">{footer}</footer>}
      </div>
    </div>
  )
}
