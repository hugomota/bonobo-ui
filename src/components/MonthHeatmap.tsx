import { cx } from '../cx'
import { sameDay, weekdayNames } from './dates'

export interface MonthHeatmapProps {
  year: number
  /** 0 = January. */
  month: number
  /** How busy each day is: day of month → number of events. */
  counts?: Record<number, number>
  /** Event counts at which a day gets darker (levels 1–4). */
  levels?: [number, number, number, number]
  selected?: Date
  onSelect?: (date: Date) => void
  weekStartsOn?: 0 | 1
  locale?: string
  today?: Date
  className?: string
}

/**
 * A month where each day is shaded by how busy it is: you see the busy
 * weeks at a glance, then tap a day to see it.
 */
export function MonthHeatmap({
  year,
  month,
  counts = {},
  levels = [1, 2, 4, 6],
  selected,
  onSelect,
  weekStartsOn = 1,
  locale,
  today = new Date(),
  className,
}: MonthHeatmapProps) {
  const first = new Date(year, month, 1)
  const days = new Date(year, month + 1, 0).getDate()
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const names = weekdayNames(locale, weekStartsOn, 'narrow')
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    first,
  )
  const dayFmt = new Intl.DateTimeFormat(locale, { dateStyle: 'full' })

  const level = (n: number) => levels.filter((l) => n >= l).length

  return (
    <div className={cx('bn-month', className)}>
      <div className="bn-month__name">{monthName}</div>
      <div className="bn-month__grid" role="grid" aria-label={monthName}>
        {names.map((n, i) => (
          <span key={i} className="bn-month__wd" aria-hidden="true">
            {n}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const n = counts[day] ?? 0
          return (
            <button
              key={day}
              type="button"
              className={cx(
                'bn-month__day',
                `bn-heat-${level(n)}`,
                sameDay(date, today) && 'bn-month__day--today',
                selected && sameDay(date, selected) && 'bn-month__day--selected',
              )}
              aria-label={`${dayFmt.format(date)}: ${n}`}
              aria-pressed={selected ? sameDay(date, selected) : undefined}
              onClick={() => onSelect?.(date)}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
