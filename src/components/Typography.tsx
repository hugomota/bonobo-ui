import type { ComponentProps } from 'react'
import { cx } from '../cx'

/** Small uppercase spaced label shown above a title. */
export function Eyebrow({ className, ...rest }: ComponentProps<'p'>) {
  return <p className={cx('bn-eyebrow', className)} {...rest} />
}

export interface TitleProps extends ComponentProps<'h1'> {
  as?: 'h1' | 'h2' | 'h3'
  size?: 'md' | 'lg' | 'xl'
}

export function Title({ as: Tag = 'h2', size = 'lg', className, ...rest }: TitleProps) {
  return <Tag className={cx('bn-title', `bn-title--${size}`, className)} {...rest} />
}

/** Big thin number, for dates, counts and times. */
export function DisplayNumber({ className, ...rest }: ComponentProps<'span'>) {
  return <span className={cx('bn-display', className)} {...rest} />
}
