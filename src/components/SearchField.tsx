import type { ComponentProps } from 'react'
import { cx } from '../cx'
import { Icon } from './Icon'

export interface SearchFieldProps extends Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'type' | 'size'
> {
  value: string
  onChange: (value: string) => void
  /** Name of the field for screen readers (there's no visible label). */
  label: string
  /** Label of the × that empties the field. */
  clearLabel?: string
}

/** A search box: magnifier on the left, × to empty it on the right. */
export function SearchField({
  value,
  onChange,
  label,
  clearLabel = 'Clear',
  className,
  ...rest
}: SearchFieldProps) {
  return (
    <div className={cx('bn-search', className)}>
      <Icon name="search" className="bn-search__icon" />
      <input
        type="search"
        enterKeyHint="search"
        aria-label={label}
        className="bn-search__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {value && (
        <button
          type="button"
          className="bn-search__clear"
          aria-label={clearLabel}
          onClick={() => onChange('')}
        >
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  )
}
