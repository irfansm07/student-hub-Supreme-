import { NavLink } from 'react-router-dom'
import { GraduationCap, Lock } from 'lucide-react'
import { cn } from '../../lib/api'
import { NAV } from '../../lib/nav'
import { useAuth } from '../../context/AuthContext'

const groups = ['Hub', 'Academic', 'Career'] as const

export function Sidebar({ open }: { open: boolean }) {
  const { isAuthenticated, openAuthModal } = useAuth()

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path !== '/' && !isAuthenticated) {
      e.preventDefault()
      openAuthModal()
    }
  }

  return (
    <aside className={cn('sidebar', open && 'open')}>
      <div className="brand">
        <div className="brand-mark">
          <GraduationCap size={22} />
        </div>
        <div>
          <h1>Aurelia</h1>
          <p>Student studio</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {groups.map((group) => (
          <div key={group} className="nav-group">
            <p className="nav-label">{group}</p>
            {NAV.filter((item) => item.group === group).map((item) => {
              const isLocked = item.to !== '/' && !isAuthenticated
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={(e) => handleNavClick(e, item.to)}
                  className={({ isActive }) => cn('nav-link', isActive && 'active', isLocked && 'locked-nav')}
                >
                  <item.icon />
                  <span>
                    <b>
                      {item.label} {isLocked && <Lock size={12} className="lock-icon" />}
                    </b>
                    <small>{isLocked ? 'Login to unlock' : item.hint}</small>
                  </span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        Press <kbd>Ctrl</kbd> <kbd>K</kbd> to jump anywhere.
      </div>
    </aside>
  )
}
