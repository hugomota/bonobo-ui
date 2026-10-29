import { cx } from '../cx'
import { addDays, sameDay, weekdayNames } from './dates'

export interface WeekStripProps {
  /** Any day of the week to show. */
  date: Date
  selected?: Date
  onSelect?: (date: Date) => void
  /** Days with something on get a small dot. */
  marked?: (date: Date) => boolean
  weekStartsOn?: 0 | 1
  locale?: string
  today?: Date
  className?: string
}

/** Seven days in a row, for the top of a day view. */
export function WeekStrip({
  date,
  selected,
  onSelect,
  marked,
  weekStartsOn = 1,
  locale,
  today = new Date(),
  className,
}: WeekStripProps) {
  const start = addDays(date, -((date.getDay() - weekStartsOn + 7) % 7))
  const names = weekdayNames(locale, weekStartsOn, 'short')
  return (
    <div className={cx('bn-week', className)}>
      {names.map((name, i) => {
        const d = addDays(start, i)
        const isSel = selected ? sameDay(d, selected) : false
        return (
          <button
            key={i}
            type="button"
            aria-pressed={isSel}
            className={cx(
              'bn-week__day',
              isSel && 'bn-week__day--selected',
              sameDay(d, today) && 'bn-week__day--today',
            )}
            onClick={() => onSelect?.(d)}
          >
            <span className="bn-week__wd">{name}</span>
            <span className="bn-week__num">{d.getDate()}</span>
            <span
              className={cx('bn-week__dot', marked?.(d) && 'bn-week__dot--on')}
              aria-hidden="true"
            />
          </button>
        )
      })}
    </div>
  )
}
