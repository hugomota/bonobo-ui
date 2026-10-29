import { useId, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../cx'

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'size'> {
  label?: ReactNode
  hint?: ReactNode
  /** "title": big borderless line, for quick-add at the top of a list. */
  variant?: 'boxed' | 'title'
}

export function TextField({
  label,
  hint,
  variant = 'boxed',
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const hintId = hint ? `${inputId}-hint` : undefined
  return (
    <div className={cx('bn-field', `bn-field--${variant}`, className)}>
      {label && (
        <label className="bn-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className="bn-field__input" aria-describedby={hintId} {...rest} />
      {hint && (
        <span id={hintId} className="bn-field__hint">
          {hint}
        </span>
      )}
    </div>
  )
}
