import type { ComponentProps } from 'react'
import { cx } from '../cx'
import { Icon, type IconName } from './Icon'

export interface FabProps extends Omit<ComponentProps<'button'>, 'children'> {
  label: string
  icon?: IconName
  /** "fixed": bottom-right corner of the screen. */
  position?: 'static' | 'fixed'
}

/** Big round "add" button. */
export function Fab({
  label,
  icon = 'plus',
  position = 'static',
  className,
  type = 'button',
  ...rest
}: FabProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx('bn-fab', `bn-fab--${position}`, className)}
      {...rest}
    >
      <Icon name={icon} size={28} />
    </button>
  )
}
