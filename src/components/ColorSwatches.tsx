import type { CSSProperties } from 'react'
import { cx } from '../cx'

export interface ColorSwatchesProps {
  colors: string[]
  value: string
  onChange: (color: string) => void
  label?: string
  size?: 'sm' | 'md'
  className?: string
}

/** Round colour dots; the chosen one gets a ring. */
export function ColorSwatches({
  colors,
  value,
  onChange,
  label = 'Colour',
  size = 'md',
  className,
}: ColorSwatchesProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('bn-swatches', `bn-swatches--${size}`, className)}
    >
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={c === value}
          aria-label={c}
          className={cx('bn-swatch', c === value && 'bn-swatch--active')}
          style={{ '--bn-swatch': c } as CSSProperties}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}
