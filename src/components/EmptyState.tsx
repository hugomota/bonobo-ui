import type { ReactNode } from 'react'
import { cx } from '../cx'
import { Icon, type IconName } from './Icon'

export interface EmptyStateProps {
  icon?: IconName
  title: ReactNode
  children?: ReactNode
  /** A button, usually. */
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon = 'inbox',
  title,
  children,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx('bn-empty', className)}>
      <span className="bn-empty__icon">
        <Icon name={icon} size={32} />
      </span>
      <p className="bn-empty__title">{title}</p>
      {children && <p className="bn-empty__text">{children}</p>}
      {action}
    </div>
  )
}
