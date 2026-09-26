import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/api'

export function PageHeader({
  kicker,
  title,
  subtitle,
  action,
}: {
  kicker: string
  title: string
  subtitle: string
  action?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        <span className="kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  )
}

export function Card({
  children,
  className = '',
  hover = false,
  style,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  style?: CSSProperties
}) {
  return <div className={cn('card', hover && 'card-hover', className)} style={style}>{children}</div>
}

export function Steps({ current, items }: { current: number; items: string[] }) {
  return (
    <ol className="steps">
      {items.map((item, i) => (
        <li key={item} className={cn('step', i <= current && 'on', i === current && 'now')}>
          <b>{i + 1}</b>
          {item}
        </li>
      ))}
    </ol>
  )
}

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return (
    <button className={cn('btn', variant !== 'primary' && variant, className)} {...props}>
      {children}
    </button>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Stat({ value, label, icon: Icon }: { value: ReactNode; label: string; icon?: any }) {
  return (
    <div className="stat">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {Icon && <Icon size={18} style={{ color: 'var(--ink-muted)' }} />}
        <strong>{value}</strong>
      </div>
      <em>{label}</em>
    </div>
  )
}

export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="empty">
      <div className="empty-mark" />
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  )
}

export function Dropzone({
  file,
  hint,
  accept,
  onFile,
}: {
  file: File | null
  hint: string
  accept: string
  onFile: (file: File | null) => void
}) {
  return (
    <label className={cn('dropzone', file && 'has-file')}>
      <input type="file" accept={accept} onChange={(e) => onFile(e.target.files?.[0] || null)} />
      <strong>{file ? file.name : hint}</strong>
      <p className="muted">{file ? 'Click to replace this file' : 'PDF, DOCX, or TXT'}</p>
    </label>
  )
}

export function ScoreRing({ value, label }: { value: number; label: string }) {
  return (
    <div className="score-block">
      <div className="score-ring" style={{ ['--p' as string]: Math.max(0, Math.min(100, value)) }}>
        <span>{Math.round(value)}</span>
      </div>
      <p className="muted">{label}</p>
    </div>
  )
}

export function Skeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="skeleton-stack">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton" style={{ width: `${88 - i * 8}%` }} />
      ))}
    </div>
  )
}
