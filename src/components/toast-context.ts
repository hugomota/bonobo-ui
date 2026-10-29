import { createContext, useContext } from 'react'

export interface ToastOptions {
  /** Button on the toast, e.g. "Undo". */
  action?: { label: string; onClick: () => void }
  /** ms, default 4000. */
  duration?: number
}

export const ToastContext = createContext<
  ((message: string, options?: ToastOptions) => void) | null
>(null)

/** Returns `toast(message, options)`. Needs a ToastProvider above. */
export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast needs a <ToastProvider> above it')
  return toast
}
