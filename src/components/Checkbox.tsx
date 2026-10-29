import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../cx'

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Ring/fill colour, e.g. the list's colour. Defaults to the accent. */
  color?: string
  label?: ReactNode
  disabled?: boolean
  className?: string
}

/** Round check, fills with a little bounce. */
export function Checkbox({ checked, onChange, color, label, disabled, className }: CheckboxProps) {
  return (
    <label
      className={cx('bn-check', disabled && 'bn-check--disabled', className)}
      style={color ? ({ '--bn-check': color } as CSSProperties) : undefined}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="bn-check__box" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      {label && <span className="bn-check__label">{label}</span>}
    </label>
  )
}
