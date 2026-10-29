import type { ReactNode } from 'react'
import { cx } from '../cx'

export interface ProgressRingProps {
  /** 0 to 1. */
  value: number
  size?: number
  thickness?: number
  color?: string
  /** In the middle; defaults to the percentage. */
  children?: ReactNode
  label?: string
  className?: string
}

export function ProgressRing({
  value,
  size = 64,
  thickness = 6,
  color = 'var(--bn-accent)',
  children,
  label,
  className,
}: ProgressRingProps) {
  const v = Math.min(1, Math.max(0, value))
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  return (
    <div
      className={cx('bn-ring', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v * 100)}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="bn-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
        />
        <circle
          className="bn-ring__bar"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
        />
      </svg>
      <span className="bn-ring__center">{children ?? `${Math.round(v * 100)}%`}</span>
    </div>
  )
}
