import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../cx'
import { toneClass, type Tone } from './tones'

export interface TabItem<T extends string> {
  value: T
  label: ReactNode
  /** What the tab shows; only the chosen tab's content is rendered. */
  content: ReactNode
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onChange: (value: T) => void
  /** Name of the group, for screen readers. */
  label: string
  /** Colour of the chosen tab (default: the background, like a raised pill). */
  tone?: Tone
  className?: string
}

/** Tabs with their panels. Arrow keys move between tabs. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  label,
  tone,
  className,
}: TabsProps<T>) {
  const id = useId()
  const list = useRef<HTMLDivElement>(null)
  const current = items.find((i) => i.value === value) ?? items[0]

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    const i = items.indexOf(current)
    const next = items[(i + step + items.length) % items.length]
    onChange(next.value)
    list.current
      ?.querySelector<HTMLButtonElement>(`[data-value="${CSS.escape(next.value)}"]`)
      ?.focus()
  }

  return (
    <div className={cx('bn-tabs', toneClass(tone), className)}>
      <div ref={list} role="tablist" aria-label={label} className="bn-tabs__list" onKeyDown={onKey}>
        {items.map((item) => {
          const on = item === current
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${id}-tab-${item.value}`}
              aria-selected={on}
              aria-controls={`${id}-panel`}
              tabIndex={on ? 0 : -1}
              data-value={item.value}
              className="bn-tabs__tab"
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {current && (
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${current.value}`}
          tabIndex={0}
          className="bn-tabs__panel"
        >
          {current.content}
        </div>
      )}
    </div>
  )
}
