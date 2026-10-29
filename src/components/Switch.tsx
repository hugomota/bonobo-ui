import type { ReactNode } from 'react'
import { cx } from '../cx'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <label className={cx('bn-switch', disabled && 'bn-switch--disabled', className)}>
      {label && <span className="bn-switch__label">{label}</span>}
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="bn-switch__track" aria-hidden="true">
        <span className="bn-switch__thumb" />
      </span>
    </label>
  )
}
