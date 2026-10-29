import { useCallback, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastOptions } from './toast-context'

interface Item extends ToastOptions {
  id: number
  message: string
}

/** Shows short messages at the bottom; use `useToast()` inside it. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  const next = useRef(0)

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), [])

  const toast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const id = next.current++
      setItems((all) => [...all.slice(-2), { id, message, ...options }])
      setTimeout(() => dismiss(id), options.duration ?? 4000)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="bn-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="bn-toast">
            <span>{t.message}</span>
            {t.action && (
              <button
                type="button"
                className="bn-toast__action"
                onClick={() => {
                  t.action?.onClick()
                  dismiss(t.id)
                }}
              >
                {t.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
