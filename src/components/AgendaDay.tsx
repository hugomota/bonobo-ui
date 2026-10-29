import type { ReactNode } from 'react'
import { cx } from '../cx'
import { sameDay } from './dates'

export interface AgendaDayProps {
  date: Date
  /** EventItem elements. None = the day shows as free. */
  children?: ReactNode
  /** Shown on an empty day. */
  emptyText?: ReactNode
  /** Small thing next to the date, e.g. the weather. */
  aside?: ReactNode
  locale?: string
  today?: Date
  className?: string
}

/** One day in a scrolling agenda: big thin date on the left, events on the right. */
export function AgendaDay({
  date,
  children,
  emptyText = '—',
  aside,
  locale,
  today = new Date(),
  className,
}: AgendaDayProps) {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)
  const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)
  const empty = !children || (Array.isArray(children) && children.length === 0)
  return (
    <section
      className={cx(
        'bn-day',
        sameDay(date, today) && 'bn-day--today',
        empty && 'bn-day--empty',
        className,
      )}
      aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date)}
    >
      <header className="bn-day__date">
        <span className="bn-day__wd">{weekday}</span>
        <span className="bn-day__num">{date.getDate()}</span>
        <span className="bn-day__month">{month}</span>
        {aside && <span className="bn-day__aside">{aside}</span>}
      </header>
      <div className="bn-day__events">
        {empty ? <p className="bn-day__free">{emptyText}</p> : children}
      </div>
    </section>
  )
}
