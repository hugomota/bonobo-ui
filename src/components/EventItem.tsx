import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../cx'
import { Icon } from './Icon'

export interface EventItemProps {
  title: ReactNode
  /** e.g. "09:30" or "Todo o dia". */
  time?: ReactNode
  /** Ends at, shown under the start time. */
  until?: ReactNode
  place?: ReactNode
  color?: string
  onClick?: () => void
  className?: string
}

export function EventItem({
  title,
  time,
  until,
  place,
  color,
  onClick,
  className,
}: EventItemProps) {
  const body = (
    <>
      <span className="bn-event__time">
        {time}
        {until && <small>{until}</small>}
      </span>
      <span className="bn-event__bar" aria-hidden="true" />
      <span className="bn-event__text">
        <span className="bn-event__title">{title}</span>
        {place && (
          <span className="bn-event__place">
            <Icon name="pin" size={14} />
            {place}
          </span>
        )}
      </span>
    </>
  )
  const style = color ? ({ '--bn-event': color } as CSSProperties) : undefined
  return onClick ? (
    <button
      type="button"
      className={cx('bn-event', 'bn-event--button', className)}
      style={style}
      onClick={onClick}
    >
      {body}
    </button>
  ) : (
    <div className={cx('bn-event', className)} style={style}>
      {body}
    </div>
  )
}
