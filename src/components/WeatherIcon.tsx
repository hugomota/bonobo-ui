import type { ReactNode } from 'react'

// Weather pictures drawn here (no icon font or library): big, flat and
// coloured so they read from across the room. `code` is a WMO weather code
// (what Open-Meteo and most weather APIs give).

const SUN = '#f59e0b'
const SUN_FILL = '#fbbf24'
const CLOUD = '#ffffff'
const CLOUD_LINE = '#94a3b8'
const DARK = '#cbd5e1'
const DARK_LINE = '#64748b'
const WATER = '#3b82f6'
const SNOW = '#60a5fa'

function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <g stroke={SUN} strokeWidth="3.5" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r * 1.35}
              y1={cy + Math.sin(a) * r * 1.35}
              x2={cx + Math.cos(a) * r * 1.75}
              y2={cy + Math.sin(a) * r * 1.75}
            />
          )
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill={SUN_FILL} stroke={SUN} strokeWidth="3" />
    </>
  )
}

function Moon({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const d =
    `M${cx + r * 0.35} ${cy - r} a${r} ${r} 0 1 0 ${r * 0.65} ${r * 1.55} ` +
    `a${r * 0.8} ${r * 0.8} 0 1 1 ${-r * 0.65} ${-r * 1.55}z`
  return <path d={d} fill="#fde68a" stroke={SUN} strokeWidth="3" strokeLinejoin="round" />
}

// A cloud whose flat bottom sits at y, centred on x; `s` = scale.
function Cloud({ x, y, s, dark = false }: { x: number; y: number; s: number; dark?: boolean }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-20 0h40a10 10 0 0 0 1-19.9A14 14 0 0 0-6.5-21 11 11 0 0 0-21-10 10 10 0 0 0-20 0z"
      fill={dark ? DARK : CLOUD}
      stroke={dark ? DARK_LINE : CLOUD_LINE}
      strokeWidth={3 / s}
      strokeLinejoin="round"
    />
  )
}

function Drops({ xs, y, len = 7 }: { xs: number[]; y: number; len?: number }) {
  return (
    <g stroke={WATER} strokeWidth="3.5" strokeLinecap="round">
      {xs.map((x) => (
        <line key={x} x1={x} y1={y} x2={x - 3} y2={y + len} />
      ))}
    </g>
  )
}

function Dots({ xs, y }: { xs: number[]; y: number }) {
  return (
    <g fill={WATER}>
      {xs.map((x, i) => (
        <circle key={x} cx={x} cy={y + (i % 2) * 5} r="2.4" />
      ))}
    </g>
  )
}

function Flakes({ xs, y }: { xs: number[]; y: number }) {
  return (
    <g stroke={SNOW} strokeWidth="2.5" strokeLinecap="round">
      {xs.map((x, i) => {
        const cy = y + (i % 2) * 6
        return (
          <g key={x}>
            <line x1={x - 4} y1={cy} x2={x + 4} y2={cy} />
            <line x1={x - 2} y1={cy - 3.5} x2={x + 2} y2={cy + 3.5} />
            <line x1={x + 2} y1={cy - 3.5} x2={x - 2} y2={cy + 3.5} />
          </g>
        )
      })}
    </g>
  )
}

const Fog = () => (
  <g stroke={CLOUD_LINE} strokeWidth="3.5" strokeLinecap="round">
    <line x1="14" y1="48" x2="50" y2="48" />
    <line x1="20" y1="55" x2="44" y2="55" />
  </g>
)

const Bolt = () => (
  <path
    d="M33 40l-6 10h6l-4 9 10-12h-6l4-7z"
    fill={SUN_FILL}
    stroke={SUN}
    strokeWidth="2"
    strokeLinejoin="round"
  />
)

const Behind = ({ isDay }: { isDay: boolean }) =>
  isDay ? <Sun cx={22} cy={22} r={9} /> : <Moon cx={22} cy={22} r={10} />

type Kind =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy'
  | 'showers'
  | 'snow'
  | 'storm'

const DRAW: Record<Kind, (isDay: boolean) => ReactNode> = {
  clear: (isDay) => (isDay ? <Sun cx={32} cy={32} r={13} /> : <Moon cx={32} cy={32} r={16} />),
  partly: (isDay) => (
    <>
      <Behind isDay={isDay} />
      <Cloud x={36} y={48} s={0.85} />
    </>
  ),
  cloudy: () => (
    <>
      <Cloud x={24} y={36} s={0.6} dark />
      <Cloud x={36} y={48} s={0.85} />
    </>
  ),
  fog: () => (
    <>
      <Cloud x={32} y={38} s={0.8} />
      <Fog />
    </>
  ),
  drizzle: () => (
    <>
      <Cloud x={32} y={38} s={0.85} />
      <Dots xs={[22, 32, 42]} y={46} />
    </>
  ),
  rain: () => (
    <>
      <Cloud x={32} y={36} s={0.85} />
      <Drops xs={[24, 34, 44]} y={44} />
    </>
  ),
  heavy: () => (
    <>
      <Cloud x={32} y={34} s={0.85} dark />
      <Drops xs={[20, 28, 36, 44]} y={42} len={10} />
    </>
  ),
  showers: (isDay) => (
    <>
      <Behind isDay={isDay} />
      <Cloud x={36} y={40} s={0.8} />
      <Drops xs={[28, 38, 48]} y={47} />
    </>
  ),
  snow: () => (
    <>
      <Cloud x={32} y={36} s={0.85} />
      <Flakes xs={[22, 32, 42]} y={48} />
    </>
  ),
  storm: () => (
    <>
      <Cloud x={32} y={34} s={0.85} dark />
      <Drops xs={[20, 44]} y={42} />
      <Bolt />
    </>
  ),
}

function kindOf(code: number): Kind {
  if (code === 0) return 'clear'
  if (code === 1 || code === 2) return 'partly'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if (code === 65 || code === 67) return 'heavy'
  if (code >= 61 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'showers'
  if (code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloudy'
}

export interface WeatherIconProps {
  /** WMO weather code. */
  code: number
  /** Night shows a moon instead of the sun. */
  isDay?: boolean
  /** What the picture shows, in words, for screen readers. */
  label: string
  /** Width and height in px (or size it with CSS through className). */
  size?: number
  className?: string
}

export function WeatherIcon({ code, isDay = true, label, size, className }: WeatherIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label}
    >
      {DRAW[kindOf(code)](isDay)}
    </svg>
  )
}
