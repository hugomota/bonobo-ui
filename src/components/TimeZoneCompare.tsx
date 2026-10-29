import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { cx } from '../cx'
import { Button, IconButton } from './Button'
import { OverlapGraph } from './OverlapGraph'
import { SegmentedControl } from './SegmentedControl'
import { Sheet } from './Sheet'
import { Switch } from './Switch'
import { TextField } from './TextField'
import { TimeZoneBubble } from './TimeZoneBubble'
import {
  cityName,
  dayDiff,
  formatMinutes,
  formatZoneDay,
  formatZoneTime,
  inputToMinutes,
  minutesToInput,
  zoneClock,
  zoneColors,
  type ZoneConfig,
} from './timezones'

const SNAP = 15 // minutes
const DRAG_START = 8 // px
const HOURS_PER_WIDTH = 6 // a drag across the whole list moves 6 hours

const defaultLabels = {
  now: 'Now',
  fromNow: 'from now',
  add: 'Add time zone',
  search: 'City or time zone',
  graph: 'Overlap',
  date: 'Date',
  share: 'Copy times',
  edit: 'Edit',
  name: 'Name',
  from: 'Available from',
  to: 'until',
  flex: 'Flexibility',
  none: 'None',
  home: 'Home time zone',
  remove: 'Remove',
  done: 'Done',
  noOverlap: 'No time works for everyone',
  hint: 'Swipe sideways to move in time. Long-press a zone to collapse it.',
}

export type TimeZoneCompareLabels = typeof defaultLabels

export interface TimeZoneCompareProps {
  /** The first zone is "home": the others are compared with it. */
  zones: ZoneConfig[]
  onZonesChange: (zones: ZoneConfig[]) => void
  /** Extra search names, e.g. { Lisboa: 'Europe/Lisbon' }. */
  aliases?: Record<string, string>
  /** Called with a text summary of the shown time ("Copy times"). */
  onShare?: (text: string) => void
  labels?: Partial<TimeZoneCompareLabels>
  locale?: string
  className?: string
}

let lastId = 0
const newId = () => `z${Date.now().toString(36)}${(lastId++).toString(36)}`

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/**
 * World clock for finding a time that suits everyone: swipe to move in
 * time, each zone turns grey outside its available hours, and the overlap
 * graph shows the best times of the day.
 */
export function TimeZoneCompare({
  zones,
  onZonesChange,
  aliases = {},
  onShare,
  labels: labelOverrides,
  locale,
  className,
}: TimeZoneCompareProps) {
  const t = { ...defaultLabels, ...labelOverrides }
  const [now, setNow] = useState(() => Date.now())
  // Chosen instant; null = live "now".
  const [pinned, setPinned] = useState<number | null>(null)
  const [graph, setGraph] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [query, setQuery] = useState('')
  const drag = useRef<{ x: number; base: number; width: number; active: boolean } | null>(null)
  const dragged = useRef(false)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  const at = new Date(pinned ?? now)
  const home = zones[0]
  const homeClock = home ? zoneClock(home.timeZone, at) : null
  const offsetMin = pinned === null ? 0 : Math.round((pinned - now) / 60_000)

  const update = (id: string, patch: Partial<ZoneConfig>) =>
    onZonesChange(zones.map((z) => (z.id === id ? { ...z, ...patch } : z)))

  // ---- swipe to move in time ----
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    dragged.current = false
    drag.current = {
      x: e.clientX,
      base: at.getTime(),
      width: e.currentTarget.clientWidth,
      active: false,
    }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.active) {
      if (Math.abs(dx) < DRAG_START) return
      d.active = true
      dragged.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    const minutes = (-dx / d.width) * HOURS_PER_WIDTH * 60
    const snapped = Math.round((d.base + minutes * 60_000) / (SNAP * 60_000)) * SNAP * 60_000
    setPinned(snapped)
  }
  const onPointerEnd = () => {
    drag.current = null
  }
  const step = (minutes: number) => {
    const base = Math.round(at.getTime() / (SNAP * 60_000)) * SNAP * 60_000
    setPinned(base + minutes * 60_000)
  }

  // ---- search for "add" ----
  const allZones = useMemo(() => {
    const ids = Intl.supportedValuesOf?.('timeZone') ?? []
    return [
      ...Object.entries(aliases).map(([name, timeZone]) => ({ name, timeZone })),
      ...ids.map((id) => ({ name: cityName(id), timeZone: id })),
    ]
  }, [aliases])
  const results = useMemo(() => {
    const q = fold(query.trim())
    if (!q) return allZones.slice(0, Object.keys(aliases).length || 20)
    return allZones
      .filter((z) => fold(z.name).includes(q) || fold(z.timeZone).includes(q))
      .slice(0, 40)
  }, [allZones, aliases, query])

  const add = (name: string, timeZone: string) => {
    onZonesChange([
      ...zones,
      {
        id: newId(),
        timeZone,
        label: name,
        start: 9 * 60,
        end: 18 * 60,
        flex: 60,
        color: zoneColors[zones.length % zoneColors.length],
      },
    ])
    setAdding(false)
    setQuery('')
  }

  const share = () => {
    const text = zones
      .map(
        (z) =>
          `${z.label}: ${formatZoneDay(z.timeZone, at, locale)} ${formatZoneTime(z.timeZone, at, locale)}`,
      )
      .join('\n')
    onShare?.(text)
  }

  const editZone = zones.find((z) => z.id === editing)
  const relDay = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  return (
    <div className={cx('bn-tzc', className)}>
      <div
        className="bn-tzc__list"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => {
          // The end of a swipe is not a tap on a zone.
          if (dragged.current) {
            e.stopPropagation()
            dragged.current = false
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') step(SNAP)
          else if (e.key === 'ArrowLeft') step(-SNAP)
          else return
          e.preventDefault()
        }}
      >
        {zones.map((z, i) => {
          const c = zoneClock(z.timeZone, at)
          const days = homeClock ? dayDiff(homeClock.day, c.day) : 0
          const diff = homeClock ? c.offset - homeClock.offset : 0
          const detail = [
            days ? relDay.format(days, 'day') : null,
            i > 0 ? formatMinutes(diff) : formatZoneDay(z.timeZone, at, locale),
          ]
            .filter(Boolean)
            .join(' · ')
          return (
            <TimeZoneBubble
              key={z.id}
              zone={z}
              at={at}
              home={i === 0}
              detail={detail}
              locale={locale}
              onClick={() => setEditing(z.id)}
              onLongPress={() => update(z.id, { collapsed: !z.collapsed })}
            />
          )
        })}
      </div>

      {graph && home && (
        <OverlapGraph
          zones={zones.filter((z) => !z.collapsed)}
          at={at}
          homeTimeZone={home.timeZone}
          onPick={(d) => setPinned(d.getTime())}
          noOverlapText={t.noOverlap}
          locale={locale}
        />
      )}

      <p className="bn-tzc__hint">{t.hint}</p>

      <div className="bn-tzc__bar">
        <IconButton icon="plus" label={t.add} variant="soft" onClick={() => setAdding(true)} />
        <IconButton icon="chevronLeft" label="−15 min" onClick={() => step(-SNAP)} />
        <button
          type="button"
          className={cx('bn-tzc__offset', offsetMin !== 0 && 'bn-tzc__offset--moved')}
          onClick={() => setPinned(null)}
          aria-live="polite"
        >
          {offsetMin === 0 ? t.now : `${formatMinutes(offsetMin)} ${t.fromNow}`}
        </button>
        <IconButton icon="chevronRight" label="+15 min" onClick={() => step(SNAP)} />
        <IconButton
          icon="chart"
          label={t.graph}
          variant={graph ? 'soft' : 'ghost'}
          aria-pressed={graph}
          onClick={() => setGraph(!graph)}
        />
        {homeClock && (
          <input
            type="date"
            className="bn-tzc__date"
            aria-label={t.date}
            value={homeClock.day}
            onChange={(e) => {
              if (!e.target.value) return
              setPinned(at.getTime() + dayDiff(homeClock.day, e.target.value) * 86_400_000)
            }}
          />
        )}
        {onShare && <IconButton icon="copy" label={t.share} onClick={share} />}
      </div>

      <Sheet open={adding} onClose={() => setAdding(false)} title={t.add}>
        <TextField
          placeholder={t.search}
          aria-label={t.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="bn-tzc__results">
          {results.map((r) => (
            <button
              key={`${r.name}|${r.timeZone}`}
              type="button"
              className="bn-tzc__result"
              onClick={() => add(r.name, r.timeZone)}
            >
              <span>
                <strong>{r.name}</strong>
                <small>{r.timeZone.replaceAll('_', ' ')}</small>
              </span>
              <span className="bn-tzc__result-time">{formatZoneTime(r.timeZone, at, locale)}</span>
            </button>
          ))}
        </div>
      </Sheet>

      {editZone && (
        <Sheet
          open
          onClose={() => setEditing(null)}
          title={t.edit}
          footer={
            <>
              <Button
                variant="ghost"
                icon="trash"
                disabled={zones.length <= 1}
                onClick={() => {
                  onZonesChange(zones.filter((z) => z.id !== editZone.id))
                  setEditing(null)
                }}
              >
                {t.remove}
              </Button>
              <Button onClick={() => setEditing(null)}>{t.done}</Button>
            </>
          }
        >
          <div className="bn-tzc__form">
            <TextField
              label={t.name}
              value={editZone.label}
              hint={editZone.timeZone.replaceAll('_', ' ')}
              onChange={(e) => update(editZone.id, { label: e.target.value })}
            />
            <div className="bn-tzc__hours">
              <TextField
                label={t.from}
                type="time"
                step={900}
                value={minutesToInput(editZone.start)}
                onChange={(e) => update(editZone.id, { start: inputToMinutes(e.target.value) })}
              />
              <TextField
                label={t.to}
                type="time"
                step={900}
                value={minutesToInput(editZone.end)}
                onChange={(e) => update(editZone.id, { end: inputToMinutes(e.target.value) })}
              />
            </div>
            <div className="bn-field">
              <span className="bn-field__label">{t.flex}</span>
              <SegmentedControl
                label={t.flex}
                options={[
                  { value: '0', label: t.none },
                  { value: '30', label: '30 min' },
                  { value: '60', label: '1 h' },
                  { value: '120', label: '2 h' },
                ]}
                value={String(editZone.flex) as '0' | '30' | '60' | '120'}
                onChange={(v) => update(editZone.id, { flex: Number(v) })}
              />
            </div>
            <Switch
              label={t.home}
              checked={zones[0]?.id === editZone.id}
              disabled={zones[0]?.id === editZone.id}
              onChange={() =>
                onZonesChange([editZone, ...zones.filter((z) => z.id !== editZone.id)])
              }
            />
          </div>
        </Sheet>
      )}
    </div>
  )
}
