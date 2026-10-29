import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cx } from '../cx'
import { Icon, type IconName } from './Icon'

export interface ListTileProps extends Omit<ComponentProps<'button'>, 'title' | 'color'> {
  title: ReactNode
  /** Big number in the corner (open tasks, unread, …). */
  count?: number
  color: string
  icon?: IconName
}

/** Coloured square for a list, in a grid of lists. */
export function ListTile({
  title,
  count,
  color,
  icon,
  className,
  type = 'button',
  ...rest
}: ListTileProps) {
  return (
    <button
      type={type}
      className={cx('bn-listtile', className)}
      style={{ '--bn-tile': color } as CSSProperties}
      {...rest}
    >
      <span className="bn-listtile__top">
        {icon && <Icon name={icon} size={22} />}
        {count !== undefined && <span className="bn-listtile__count">{count}</span>}
      </span>
      <span className="bn-listtile__title">{title}</span>
    </button>
  )
}
