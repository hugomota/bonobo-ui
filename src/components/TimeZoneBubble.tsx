import { useRef, type CSSProperties, type ReactNode } from 'react'
import { cx } from '../cx'
import { Icon } from './Icon'
import { availability, formatZoneTime, isNight, zoneClock, type ZoneConfig } from './timezones'

const LONG_PRESS_MS = 500

export interface TimeZoneBubbleProps {
  zone: ZoneConfig
  at: Date
  /** Under the name, e.g. "amanhã · +1 h". */
  detail?: ReactNode
  locale?: string
  home?: boolean
  onClick?: () => void
  onLongPress?: () => void
  className?: string
}

/**
 * One time zone: name, local time, and a colour that says whether the
 * person is available (full colour), nearly (light) or away (grey).
 */
export function TimeZoneBubble({
  zone,
  at,
  detail,
  locale,
  home,
  onClick,
  onLongPress,
  className,
}: TimeZoneBubbleProps) {
  const timer = useRef<number | undefined>(undefined)
  const start = useRef<[number, number]>([0, 0])
  const pressed = useRef(false)

  const minutes = zoneClock(zone.timeZone, at).minutes
  const state = availability(zone, minutes)
  const cancel = () => window.clearTimeout(timer.current)

  return (
    <button
      type="button"
      className={cx('bn-tz', `bn-tz--${state}`, zone.collapsed && 'bn-tz--collapsed', className)}
      style={{ '--bn-tz': zone.color } as CSSProperties}
      aria-label={`${zone.label}, ${formatZoneTime(zone.timeZone, at, locale)}`}
      onPointerDown={(e) => {
        pressed.current = false
        start.current = [e.clientX, e.clientY]
        if (onLongPress)
          timer.current = window.setTimeout(() => {
            pressed.current = true
            onLongPress()
          }, LONG_PRESS_MS)
      }}
      onPointerMove={(e) => {
        const [x, y] = start.current
        if (Math.abs(e.clientX - x) > 8 || Math.abs(e.clientY - y) > 8) cancel()
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onContextMenu={(e) => onLongPress && e.preventDefault()}
      onClick={() => {
        if (pressed.current) pressed.current = false
        else onClick?.()
      }}
    >
      <span className="bn-tz__text">
        <span className="bn-tz__name">
          {home && <Icon name="home" size={14} />}
          {zone.label}
        </span>
        {detail && <span className="bn-tz__detail">{detail}</span>}
      </span>
      <Icon name={isNight(minutes) ? 'moon' : 'sun'} size={zone.collapsed ? 14 : 18} />
      <span className="bn-tz__time">{formatZoneTime(zone.timeZone, at, locale)}</span>
    </button>
  )
}
