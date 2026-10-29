import type { ComponentProps } from 'react'
import { cx } from '../cx'
import { Icon, type IconName } from './Icon'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'solid' | 'soft' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  /** Full width. */
  block?: boolean
}

export function Button({
  variant = 'solid',
  size = 'md',
  icon,
  block,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'bn-btn',
        `bn-btn--${variant}`,
        `bn-btn--${size}`,
        block && 'bn-btn--block',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  )
}

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  icon: IconName
  /** Said by screen readers and shown as a tooltip. */
  label: string
  variant?: 'solid' | 'soft' | 'ghost'
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx('bn-iconbtn', `bn-btn--${variant}`, className)}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  )
}
