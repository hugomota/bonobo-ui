import type { ComponentProps } from 'react'
import { cx } from '../cx'

export interface CardProps extends ComponentProps<'div'> {
  /** "flat": filled with the surface colour; "raised": paper with a shadow. */
  variant?: 'flat' | 'raised'
}

export function Card({ variant = 'flat', className, ...rest }: CardProps) {
  return <div className={cx('bn-card', `bn-card--${variant}`, className)} {...rest} />
}
