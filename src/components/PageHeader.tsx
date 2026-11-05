import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../cx'

export interface PageHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode
  /** A line under the title. */
  sub?: ReactNode
  /** Buttons on the right (they wrap under the title on phones). */
  actions?: ReactNode
}

/** A page's big light title. */
export function PageHeader({ title, sub, actions, className, ...rest }: PageHeaderProps) {
  return (
    <div className={cx('bn-pagehead', className)} {...rest}>
      <div>
        <h1 className="bn-pagehead__title">{title}</h1>
        {sub && <p className="bn-pagehead__sub">{sub}</p>}
      </div>
      {actions}
    </div>
  )
}

export interface SectionTitleProps extends ComponentProps<'h2'> {
  as?: 'h2' | 'h3'
}

/** Small spaced capitals over a card or a group of cards. */
export function SectionTitle({ as: Tag = 'h2', className, ...rest }: SectionTitleProps) {
  return <Tag className={cx('bn-section-title', className)} {...rest} />
}
