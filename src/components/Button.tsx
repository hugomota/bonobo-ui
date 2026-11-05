import type { ComponentProps } from 'react'
import { cx } from '../cx'
import { Icon, type IconName } from './Icon'
import { toneClass, type Tone } from './tones'

type Variant = 'solid' | 'soft' | 'outline' | 'ghost'

interface Look {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  /** Colour; without one, solid uses the theme's accent. */
  tone?: Tone
  icon?: IconName
  /** Full width. */
  block?: boolean
  /** As wide as it is high (one symbol inside). */
  square?: boolean
}

function lookClass({ variant = 'solid', size = 'md', tone, block, square }: Look) {
  return cx(
    'bn-btn',
    `bn-btn--${variant}`,
    `bn-btn--${size}`,
    toneClass(tone),
    block && 'bn-btn--block',
    square && 'bn-btn--square',
  )
}

export interface ButtonProps extends ComponentProps<'button'>, Look {}

export function Button({
  variant,
  size = 'md',
  tone,
  icon,
  block,
  square,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(lookClass({ variant, size, tone, block, square }), className)}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
      {children}
    </button>
  )
}

export interface ButtonLinkProps extends ComponentProps<'a'>, Look {}

/** A link that looks like a Button. */
export function ButtonLink({
  variant,
  size = 'md',
  tone,
  icon,
  block,
  square,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <a className={cx(lookClass({ variant, size, tone, block, square }), className)} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
      {children}
    </a>
  )
}

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  icon: IconName
  /** Said by screen readers and shown as a tooltip. */
  label: string
  variant?: Variant
  tone?: Tone
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  tone,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx('bn-iconbtn', `bn-btn--${variant}`, toneClass(tone), className)}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  )
}
