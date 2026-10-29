import { useId, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../cx'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Group name for screen readers. */
  label: string
  className?: string
}

/** A row of choices with a sliding pill under the chosen one. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  const name = useId()
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx('bn-segmented', className)}
      style={{ '--bn-seg-n': options.length, '--bn-seg-i': index } as CSSProperties}
    >
      <span className="bn-segmented__pill" aria-hidden="true" />
      {options.map((o) => (
        <label key={o.value} className="bn-segmented__item">
          <input
            type="radio"
            name={name}
            checked={o.value === value}
            onChange={() => onChange(o.value)}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  )
}
