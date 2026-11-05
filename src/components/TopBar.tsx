import type { ReactNode } from 'react'
import { cx } from '../cx'
import { toneClass, type Tone } from './tones'

export interface TopBarItem {
  href: string
  label: string
  /** An emoji or an <Icon>; on phones only the icon shows. */
  icon: ReactNode
  /** Fill of the item when it's the current page. */
  tone?: Tone
  current?: boolean
}

export interface TopBarProps {
  /** Logo + name, linking home (the name hides on phones). */
  brand?: { href: string; logo: ReactNode; name: ReactNode; label?: string; current?: boolean }
  /** Shown instead of the brand, e.g. a "‹ Back" button. */
  back?: ReactNode
  items: TopBarItem[]
  /** Name of the navigation, for screen readers. */
  label: string
  className?: string
}

/** Sticky bar on top of every page: home (or back), then one link per section. */
export function TopBar({ brand, back, items, label, className }: TopBarProps) {
  return (
    <header className={cx('bn-topbar', className)}>
      <div className="bn-topbar__inner">
        {back ??
          (brand && (
            <a
              className="bn-topbar__brand"
              href={brand.href}
              aria-label={brand.label}
              aria-current={brand.current ? 'page' : undefined}
            >
              {brand.logo}
              <span className="bn-topbar__brand-label">{brand.name}</span>
            </a>
          ))}
        <nav className="bn-topbar__nav" aria-label={label}>
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cx('bn-topbar__item', toneClass(item.tone))}
              aria-current={item.current ? 'page' : undefined}
            >
              <span className="bn-topbar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="bn-topbar__label">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
