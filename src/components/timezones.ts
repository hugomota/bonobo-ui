// Time zone maths with the browser's Intl only (no library, no tz data).

export interface ZoneConfig {
  id: string
  /** IANA name, e.g. "Europe/Lisbon". */
  timeZone: string
  /** Shown name: a city, a person, a client… */
  label: string
  /** Available hours in the zone's local time, minutes after midnight (9:00 = 540). */
  start: number
  end: number
  /** Extra minutes before and after that still work. */
  flex: number
  color: string
  /** Collapsed zones are small and left out of the overlap graph. */
  collapsed?: boolean
}

export type Availability = 'available' | 'flexible' | 'away'

export const zoneColors = [
  '#4a7dff',
  '#ff9a3c',
  '#34c47c',
  '#8a5cf6',
  '#ff5d5d',
  '#1fb8b0',
  '#ff6fb1',
  '#ffcc33',
]

const formatters = new Map<string, Intl.DateTimeFormat>()
function formatter(key: string, locale: string | undefined, options: Intl.DateTimeFormatOptions) {
  let f = formatters.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(locale, options)
    formatters.set(key, f)
  }
  return f
}

export interface ZoneClock {
  /** Minutes after local midnight. */
  minutes: number
  /** Local date, "YYYY-MM-DD". */
  day: string
  /** Minutes ahead of UTC. */
  offset: number
}

/** Local time, date and UTC offset of a zone at an instant. */
export function zoneClock(timeZone: string, at: Date): ZoneClock {
  const parts = formatter(`clock|${timeZone}`, 'en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'longOffset',
  }).formatToParts(at)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  const m = /GMT([+-])(\d{1,2}):?(\d{2})?/.exec(get('timeZoneName'))
  const offset = m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0)) : 0
  return {
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
    day: `${get('year')}-${get('month')}-${get('day')}`,
    offset,
  }
}

/** "15:30" in the zone, in the locale's style. */
export function formatZoneTime(timeZone: string, at: Date, locale?: string): string {
  return formatter(`time|${locale}|${timeZone}`, locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(at)
}

/** "qua., 29/10" in the zone. */
export function formatZoneDay(timeZone: string, at: Date, locale?: string): string {
  return formatter(`day|${locale}|${timeZone}`, locale, {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(at)
}

/** Whole days from local date a to b ("YYYY-MM-DD"). */
export function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
}

function inRange(m: number, start: number, end: number) {
  return start <= end ? m >= start && m < end : m >= start || m < end
}

/** Is the zone's person available at this local time (minutes after midnight)? */
export function availability(zone: ZoneConfig, minutes: number): Availability {
  if (zone.start === zone.end || inRange(minutes, zone.start, zone.end)) return 'available'
  if (zone.flex > 0) {
    const s = (zone.start - zone.flex + 1440) % 1440
    const e = (zone.end + zone.flex) % 1440
    if (inRange(minutes, s, e)) return 'flexible'
  }
  return 'away'
}

/** Night is 21:00–07:00. */
export function isNight(minutes: number): boolean {
  return minutes < 7 * 60 || minutes >= 21 * 60
}

/** "+5 h 30", "−3 h", "+45 min", "0 h". */
export function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0 h'
  const sign = minutes > 0 ? '+' : '−'
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  if (!h) return `${sign}${m} min`
  return m ? `${sign}${h} h ${String(m).padStart(2, '0')}` : `${sign}${h} h`
}

/** "Europe/Lisbon" → "Lisbon". */
export function cityName(timeZone: string): string {
  return (timeZone.split('/').pop() ?? timeZone).replaceAll('_', ' ')
}

/** "10:30" ↔ 630. */
export function minutesToInput(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}
export function inputToMinutes(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return ((h || 0) * 60 + (m || 0)) % 1440
}

export interface OverlapSample {
  at: Date
  /** 0 to 1: share of the zones that can make it (flexible counts half). */
  score: number
  /** Everyone is inside their available hours. */
  all: boolean
}

/** Samples a stretch of time, e.g. 96 × 15 min = one day. */
export function overlapSamples(
  zones: ZoneConfig[],
  from: Date,
  steps: number,
  stepMinutes: number,
): OverlapSample[] {
  return Array.from({ length: steps }, (_, i) => {
    const at = new Date(from.getTime() + i * stepMinutes * 60_000)
    let sum = 0
    let all = zones.length > 0
    for (const z of zones) {
      const a = availability(z, zoneClock(z.timeZone, at).minutes)
      sum += a === 'available' ? 1 : a === 'flexible' ? 0.5 : 0
      if (a !== 'available') all = false
    }
    return { at, score: zones.length ? sum / zones.length : 0, all }
  })
}
