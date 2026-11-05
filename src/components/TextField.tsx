import { useId, type ComponentProps, type ReactNode } from 'react'
import { cx } from '../cx'

interface FieldLook {
  label?: ReactNode
  hint?: ReactNode
  className?: string
}

/** Label + control + hint, shared by the text field, text area and select. */
function Field({
  label,
  hint,
  variant = 'boxed',
  className,
  id,
  children,
}: FieldLook & {
  variant?: 'boxed' | 'title'
  id?: string
  children: (ids: { id: string; hintId?: string }) => ReactNode
}) {
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
      {children({ id: inputId, hintId })}
      {hint && (
        <span id={hintId} className="bn-field__hint">
          {hint}
        </span>
      )}
    </div>
  )
}

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'size'>, FieldLook {
  /** "title": big borderless line, for quick-add at the top of a list. */
  variant?: 'boxed' | 'title'
}

export function TextField({ label, hint, variant, className, id, ...rest }: TextFieldProps) {
  return (
    <Field label={label} hint={hint} variant={variant} className={className} id={id}>
      {(ids) => (
        <input id={ids.id} className="bn-field__input" aria-describedby={ids.hintId} {...rest} />
      )}
    </Field>
  )
}

export interface TextAreaProps extends ComponentProps<'textarea'>, FieldLook {}

/** Several lines of text; grows only when the person drags its corner. */
export function TextArea({ label, hint, className, id, ...rest }: TextAreaProps) {
  return (
    <Field label={label} hint={hint} className={className} id={id}>
      {(ids) => (
        <textarea id={ids.id} className="bn-field__input" aria-describedby={ids.hintId} {...rest} />
      )}
    </Field>
  )
}

export interface SelectFieldProps extends ComponentProps<'select'>, FieldLook {}

/** The device's own picker (best on phones), in the field look. */
export function SelectField({ label, hint, className, id, ...rest }: SelectFieldProps) {
  return (
    <Field label={label} hint={hint} className={className} id={id}>
      {(ids) => (
        <select id={ids.id} className="bn-field__input" aria-describedby={ids.hintId} {...rest} />
      )}
    </Field>
  )
}
