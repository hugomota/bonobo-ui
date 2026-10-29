import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../cx'
import { Icon } from './Icon'

export interface TagProps {
  children: ReactNode
  /** Dot colour. */
  color?: string
  /** Shows a small × that calls this. */
  onRemove?: () => void
  className?: string
}

export function Tag({ children, color, onRemove, className }: TagProps) {
  return (
    <span
      className={cx('bn-tag', className)}
      style={color ? ({ '--bn-tag': color } as CSSProperties) : undefined}
    >
      {color && <span className="bn-tag__dot" aria-hidden="true" />}
      {children}
      {onRemove && (
        <button type="button" className="bn-tag__remove" onClick={onRemove} aria-label="Remove">
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  )
}
