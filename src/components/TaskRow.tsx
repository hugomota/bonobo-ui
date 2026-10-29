import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { cx } from '../cx'
import { Checkbox } from './Checkbox'
import { Icon } from './Icon'

const SWIPE_START = 8 // px before a press becomes a swipe
const SWIPE_COMMIT = 90 // px to complete / delete

export interface TaskRowProps {
  title: ReactNode
  note?: ReactNode
  done: boolean
  onToggle: (done: boolean) => void
  /** Swipe left (or the trash button) deletes. Leave out to turn it off. */
  onDelete?: () => void
  /** The list's colour: check ring and swipe background. */
  color?: string
  /** Shown on the right, e.g. a due date. */
  meta?: ReactNode
  /** Tags or other small things under the title. */
  children?: ReactNode
  className?: string
}

/**
 * One task. Swipe right to tick it, left to delete it; the coloured
 * background shows what will happen before you let go.
 */
export function TaskRow({
  title,
  note,
  done,
  onToggle,
  onDelete,
  color,
  meta,
  children,
  className,
}: TaskRowProps) {
  const [dx, setDx] = useState(0)
  const drag = useRef<{ x: number; y: number; active: boolean } | null>(null)

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    drag.current = { x: e.clientX, y: e.clientY, active: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const x = e.clientX - d.x
    const y = e.clientY - d.y
    if (!d.active) {
      if (Math.abs(y) > SWIPE_START) {
        drag.current = null // vertical: let the page scroll
        return
      }
      if (Math.abs(x) < SWIPE_START) return
      d.active = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    setDx(onDelete ? x : Math.max(0, x))
  }
  const onPointerEnd = () => {
    const d = drag.current
    drag.current = null
    if (d?.active) {
      if (dx > SWIPE_COMMIT) onToggle(!done)
      else if (dx < -SWIPE_COMMIT) onDelete?.()
    }
    setDx(0)
  }

  const action = dx > SWIPE_COMMIT ? 'done' : dx < -SWIPE_COMMIT ? 'delete' : null
  return (
    <div
      className={cx('bn-task', done && 'bn-task--done', className)}
      style={color ? ({ '--bn-task': color } as CSSProperties) : undefined}
    >
      <div
        className={cx('bn-task__under', action && `bn-task__under--${action}`)}
        aria-hidden="true"
      >
        <Icon name={done ? 'undo' : 'check'} />
        <Icon name="trash" />
      </div>
      <div
        className={cx('bn-task__body', dx !== 0 && 'bn-task__body--dragging')}
        style={{ transform: dx ? `translateX(${dx}px)` : undefined }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <Checkbox checked={done} onChange={onToggle} color={color} />
        <div className="bn-task__text">
          <span className="bn-task__title">{title}</span>
          {note && <span className="bn-task__note">{note}</span>}
          {children && <div className="bn-task__extra">{children}</div>}
        </div>
        {meta && <span className="bn-task__meta">{meta}</span>}
        {onDelete && (
          <button type="button" className="bn-task__delete" onClick={onDelete} aria-label="Delete">
            <Icon name="trash" size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
