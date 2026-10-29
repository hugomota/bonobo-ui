import type { PointerEvent, ReactNode } from 'react'
import { cx } from '../cx'
import { formatZoneTime, overlapSamples, zoneClock, type ZoneConfig } from './timezones'

const STEP = 15 // minutes per bar
const STEPS = (24 * 60) / STEP

export interface OverlapGraphProps {
  /** Zones that count (leave the collapsed ones out). */
  zones: ZoneConfig[]
  /** The day shown is this instant's day in the home zone. */
  at: Date
  homeTimeZone: string
  /** Tap or drag on the graph. */
  onPick?: (at: Date) => void
  /** Shown when no time has everyone available. */
  noOverlapText?: ReactNode
  locale?: string
  className?: string
}

/**
 * One day in 15-minute bars: the taller the bar, the more people can make
 * it. Bars where everyone is available are in the accent colour.
 */
export function OverlapGraph({
  zones,
  at,
  homeTimeZone,
  onPick,
  noOverlapText = 'No time works for everyone',
  locale,
  className,
}: OverlapGraphProps) {
  const clock = zoneClock(homeTimeZone, at)
  const midnight = new Date(at.getTime() - clock.minutes * 60_000)
  midnight.setSeconds(0, 0)
  const samples = overlapSamples(zones, midnight, STEPS, STEP)
  const cursor = Math.min(STEPS - 1, Math.max(0, Math.floor(clock.minutes / STEP)))
  const anyAll = samples.some((s) => s.all)

  const pick = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.min(STEPS - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * STEPS)))
    onPick?.(samples[i].at)
  }

  return (
    <div className={cx('bn-overlap', className)}>
      <div
        className="bn-overlap__plot"
        role="img"
        aria-label={samples
          .filter((s, i) => s.all && !samples[i - 1]?.all)
          .map((s) => formatZoneTime(homeTimeZone, s.at, locale))
          .join(', ')}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          pick(e)
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) pick(e)
        }}
      >
        <svg viewBox={`0 0 ${STEPS} 40`} preserveAspectRatio="none" aria-hidden="true">
          {samples.map((s, i) => (
            <rect
              key={i}
              x={i + 0.12}
              width={0.76}
              y={40 - Math.max(1.5, s.score * 40)}
              height={Math.max(1.5, s.score * 40)}
              rx={0.38}
              className={cx('bn-overlap__bar', s.all && 'bn-overlap__bar--all')}
            />
          ))}
        </svg>
        <span
          className="bn-overlap__cursor"
          style={{ left: `${((cursor + 0.5) / STEPS) * 100}%` }}
        />
      </div>
      <div className="bn-overlap__hours" aria-hidden="true">
        {[0, 6, 12, 18].map((h) => (
          <span key={h} style={{ left: `${(h / 24) * 100}%` }}>
            {formatZoneTime(homeTimeZone, new Date(midnight.getTime() + h * 3_600_000), locale)}
          </span>
        ))}
      </div>
      {!anyAll && zones.length > 1 && <p className="bn-overlap__none">{noOverlapText}</p>}
    </div>
  )
}
