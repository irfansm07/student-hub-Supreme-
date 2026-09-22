import { Menu, Moon, Search, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { pageMeta } from '../../lib/nav'

export function Topbar({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) {
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const meta = pageMeta(pathname)

  return (
    <header className="topbar">
      <button className="icon-btn mobile-toggle" onClick={onMenu} aria-label="Open menu">
        <Menu size={18} />
      </button>
      <div className="crumb">
        <span>{meta.group}</span>
        <strong>{meta.label}</strong>
      </div>
      <button className="search-chip" onClick={onSearch}>
        <Search size={16} />
        Search tools
        <kbd>Ctrl K</kbd>
      </button>
      <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
