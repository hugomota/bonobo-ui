import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../cx'
import type { Tone } from './tones'
import { toneClass } from './tones'

const TONE: Record<AlertProps['kind'] & string, Tone | undefined> = {
  info: undefined,
  success: 'green',
  warning: 'orange',
  error: 'red',
}

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  kind?: 'info' | 'success' | 'warning' | 'error'
  title?: ReactNode
  /** Something before the text: an emoji or an <Icon>. */
  icon?: ReactNode
}

/** A notice in the page. Errors are announced at once, the rest politely. */
export function Alert({ kind = 'info', title, icon, className, children, ...rest }: AlertProps) {
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={cx('bn-alert', toneClass(TONE[kind]), className)}
      {...rest}
    >
      {icon && (
        <span className="bn-alert__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="bn-alert__body">
        {title && <p className="bn-alert__title">{title}</p>}
        {children}
      </div>
    </div>
  )
}
