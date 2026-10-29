import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent,
  type Ref,
} from 'react'
import { cx } from '../cx'
import type { ToolKind } from './ToolGlyph'

interface Stroke {
  kind: ToolKind
  color: string
  width: number
  points: [number, number][]
}

export interface SketchpadHandle {
  clear: () => void
  undo: () => void
  /** PNG of the drawing (transparent where the paper shows). */
  toDataURL: () => string
}

export interface SketchpadProps {
  tool: ToolKind
  color: string
  /** Base line width in CSS px. */
  size?: number
  /** Paper look behind the ink. */
  paper?: 'dots' | 'lines' | 'plain'
  onChange?: (strokes: number) => void
  ref?: Ref<SketchpadHandle>
  className?: string
  'aria-label'?: string
}

// How each tool lays ink: width factor, opacity, how it blends.
const inks: Record<ToolKind, { w: number; alpha: number; op: GlobalCompositeOperation }> = {
  pen: { w: 1, alpha: 1, op: 'source-over' },
  pencil: { w: 0.7, alpha: 0.55, op: 'source-over' },
  marker: { w: 4.5, alpha: 0.35, op: 'source-over' },
  brush: { w: 2.4, alpha: 0.85, op: 'source-over' },
  eraser: { w: 5, alpha: 1, op: 'destination-out' },
}

function draw(ctx: CanvasRenderingContext2D, s: Stroke) {
  const ink = inks[s.kind]
  const pts = s.points
  ctx.save()
  ctx.globalAlpha = ink.alpha
  ctx.globalCompositeOperation = ink.op
  ctx.strokeStyle = s.color
  ctx.fillStyle = s.color
  ctx.lineWidth = s.width * ink.w
  ctx.lineCap = s.kind === 'marker' ? 'square' : 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  if (pts.length === 1) {
    ctx.arc(pts[0][0], pts[0][1], ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
  } else {
    // Smooth the line through the midpoints of the points.
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i]
      const [nx, ny] = pts[i + 1]
      ctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2)
    }
    const last = pts[pts.length - 1]
    ctx.lineTo(last[0], last[1])
    ctx.stroke()
  }
  ctx.restore()
}

/** A sheet of paper to draw on with the mouse, a finger or a pen. */
export function Sketchpad({
  tool,
  color,
  size = 3,
  paper = 'dots',
  onChange,
  ref,
  className,
  'aria-label': ariaLabel = 'Drawing',
}: SketchpadProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const strokes = useRef<Stroke[]>([])
  const current = useRef<Stroke | null>(null)

  const redraw = useCallback(() => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, c.width, c.height)
    for (const s of strokes.current) draw(ctx, s)
    if (current.current) draw(ctx, current.current)
  }, [])

  // Keep the bitmap sharp at the element's real size.
  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      redraw()
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [redraw])

  useImperativeHandle(
    ref,
    () => ({
      clear() {
        strokes.current = []
        redraw()
        onChange?.(0)
      },
      undo() {
        strokes.current = strokes.current.slice(0, -1)
        redraw()
        onChange?.(strokes.current.length)
      },
      toDataURL: () => canvas.current?.toDataURL('image/png') ?? '',
    }),
    [redraw, onChange],
  )

  const point = (e: PointerEvent<HTMLCanvasElement>): [number, number] => {
    const r = e.currentTarget.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top]
  }

  return (
    <canvas
      ref={canvas}
      role="img"
      aria-label={ariaLabel}
      className={cx('bn-sketch', `bn-sketch--${paper}`, className)}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.currentTarget.setPointerCapture(e.pointerId)
        current.current = { kind: tool, color, width: size, points: [point(e)] }
        redraw()
      }}
      onPointerMove={(e) => {
        if (!current.current) return
        // Coalesced events give smoother lines with fast pens.
        const events = e.nativeEvent.getCoalescedEvents?.() ?? [e.nativeEvent]
        const r = e.currentTarget.getBoundingClientRect()
        for (const ev of events)
          current.current.points.push([ev.clientX - r.left, ev.clientY - r.top])
        redraw()
      }}
      onPointerUp={() => {
        if (!current.current) return
        strokes.current = [...strokes.current, current.current]
        current.current = null
        redraw()
        onChange?.(strokes.current.length)
      }}
      onPointerCancel={() => {
        current.current = null
        redraw()
      }}
    />
  )
}
