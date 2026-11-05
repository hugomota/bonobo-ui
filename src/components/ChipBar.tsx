import type { ReactNode } from 'react'
import { cx } from '../cx'
import { toneClass, type Tone } from './tones'

export interface Chip<T extends string> {
  value: T
  label: ReactNode
  /** Shown in a small bubble after the label. */
  count?: number
}

export interface ChipBarProps<T extends string> {
  items: Chip<T>[]
  value: T
  onChange: (value: T) => void
  /** Name of the group, for screen readers. */
  label: string
  /** Colour of the chosen chip (default: ink). */
  tone?: Tone
  className?: string
}

/** A row of filter chips that scrolls sideways when it doesn't fit. */
export function ChipBar<T extends string>({
  items,
  value,
  onChange,
  label,
  tone,
  className,
}: ChipBarProps<T>) {
  return (
    <nav aria-label={label} className={cx('bn-chips', toneClass(tone), className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={item.value === value}
          className="bn-chip"
          onClick={() => onChange(item.value)}
        >
          {item.label}
          {item.count != null && <span className="bn-chip__count">{item.count}</span>}
        </button>
      ))}
    </nav>
  )
}
