import type { ComponentProps } from 'react'
import { cx } from '../cx'
import { toneClass, type Tone } from './tones'

export interface BadgeProps extends ComponentProps<'span'> {
  /** "soft" (light fill, default), "solid" (filled) or "muted" (grey). */
  variant?: 'soft' | 'solid' | 'muted'
  tone?: Tone
}

/** A small rounded label: a state, a count, "New". */
export function Badge({ variant = 'soft', tone, className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(
        'bn-badge',
        variant !== 'soft' && `bn-badge--${variant}`,
        toneClass(tone),
        className,
      )}
      {...rest}
    />
  )
}
