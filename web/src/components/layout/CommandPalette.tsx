import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from '../../lib/nav'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    return NAV.filter((item) => !query || `${item.label} ${item.hint} ${item.group}`.toLowerCase().includes(query))
  }, [q])

  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="palette-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="palette"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="palette-search">
              <Search size={18} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a tool…" />
            </div>
            <div className="palette-list">
              {results.map((item) => (
                <button
                  key={item.to}
                  className="palette-item"
                  onClick={() => {
                    navigate(item.to)
                    onClose()
                  }}
                >
                  <item.icon size={18} />
                  <span>
                    <b>{item.label}</b>
                    <small>{item.hint}</small>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
