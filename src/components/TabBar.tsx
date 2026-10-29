import { cx } from '../cx'
import { Icon, type IconName } from './Icon'

export interface TabItem {
  id: string
  label: string
  icon: IconName
}

export interface TabBarProps {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  /** "fixed": stuck to the bottom of the screen. */
  position?: 'static' | 'fixed'
  className?: string
}

export function TabBar({ items, value, onChange, position = 'static', className }: TabBarProps) {
  return (
    <nav className={cx('bn-tabbar', `bn-tabbar--${position}`, className)}>
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-current={t.id === value ? 'page' : undefined}
          className={cx('bn-tabbar__tab', t.id === value && 'bn-tabbar__tab--active')}
          onClick={() => onChange(t.id)}
        >
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
