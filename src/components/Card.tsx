import type { ComponentProps, ElementType } from 'react'
import { cx } from '../cx'
import { toneClass, type Tone } from './tones'

export interface CardProps extends ComponentProps<'div'> {
  /**
   * "flat": filled with the surface colour; "raised": paper with a shadow;
   * "paper": paper, no shadow; "outline": a thin line; "filled": the tone.
   */
  variant?: 'flat' | 'raised' | 'paper' | 'outline' | 'filled'
  /** Inner space: md (default), sm, or none (content to the edges). */
  padding?: 'md' | 'sm' | 'none'
  tone?: Tone
  /** The element: a list item, an article, a link... (default div). */
  as?: 'div' | 'li' | 'article' | 'section' | 'a' | 'button'
  href?: string
}

export function Card({
  variant = 'flat',
  padding = 'md',
  tone,
  as = 'div',
  className,
  ...rest
}: CardProps) {
  const Tag = as as ElementType
  return (
    <Tag
      className={cx(
        'bn-card',
        `bn-card--${variant}`,
        padding !== 'md' && `bn-card--pad-${padding}`,
        toneClass(tone),
        className,
      )}
      {...rest}
    />
  )
}
