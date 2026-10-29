import { cx } from '../cx'
import { ToolGlyph } from './ToolGlyph'
import { defaultTools, type Tool } from './tools'

export interface ToolPaletteProps {
  tools?: Tool[]
  value: string
  onChange: (id: string) => void
  /** Current ink colour, shown on every tool. */
  color: string
  label?: string
  className?: string
}

/** Real-looking tools in a tray; the chosen one slides up. */
export function ToolPalette({
  tools = defaultTools,
  value,
  onChange,
  color,
  label = 'Tools',
  className,
}: ToolPaletteProps) {
  return (
    <div role="radiogroup" aria-label={label} className={cx('bn-tools', className)}>
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={t.id === value}
          aria-label={t.label}
          title={t.label}
          className={cx('bn-tools__tool', t.id === value && 'bn-tools__tool--active')}
          onClick={() => onChange(t.id)}
        >
          <ToolGlyph kind={t.kind} color={color} />
        </button>
      ))}
    </div>
  )
}
