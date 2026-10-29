import type { HTMLAttributes } from 'react'
import { cx } from '../cx'
import type { Theme } from './themes'

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** "auto" follows the device: paper when light, ink when dark. */
  theme?: Theme
}

/** Sets the theme for everything inside. Can be nested (e.g. a coloured card). */
export function ThemeProvider({ theme = 'auto', className, ...rest }: ThemeProviderProps) {
  return <div data-bn-theme={theme} className={cx('bn-root', className)} {...rest} />
}
