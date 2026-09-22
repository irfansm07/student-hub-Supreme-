import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Toast = { id: number; message: string }

const ToastContext = createContext<{ push: (message: string) => void }>({
  push: () => undefined,
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const push = useCallback((message: string) => {
    const id = Date.now()
    setItems((prev) => [...prev, { id, message }])
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="toast"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
            >
              {item.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
