import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, GraduationCap, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth()
    const [mode, setMode] = useState<'login' | 'signup'>('signup')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [major, setMajor] = useState('Computer Science')
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSuccess(true)
        setTimeout(() => {
            login({
                name: name || (mode === 'signup' ? 'Alex Rivers' : 'Student Member'),
                email: email || 'student@university.edu',
                major: major || 'Computer Science & AI',
            })
            setIsSuccess(false)
        }, 700)
    }

    const handleDemoLogin = () => {
        setIsSuccess(true)
        setTimeout(() => {
            login({
                name: 'Alex Rivers (Demo)',
                email: 'alex.rivers@stanford.edu',
                major: 'Computer Science & AI',
            })
            setIsSuccess(false)
        }, 500)
    }

    if (!isAuthModalOpen) return null

    return (
        <AnimatePresence>
            <div className="auth-overlay" onClick={closeAuthModal}>
                <motion.div
                    className="auth-modal"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                    <button className="auth-close" onClick={closeAuthModal} aria-label="Close modal">
                        <X size={20} />
                    </button>

                    <div className="auth-header">
                        <div className="auth-badge">
                            <Sparkles size={14} />
                            <span>Student Hub Passport</span>
                        </div>
                        <h2>{mode === 'signup' ? 'Create Free Account' : 'Student Sign In'}</h2>
                        <p>
                            {mode === 'signup'
                                ? 'Sign up to unlock AI Study Summarizer, Resume Studio, and Job Application Tracker.'
                                : 'Sign in to access your saved summaries, ATS scores, and Kanban tracker.'}
                        </p>
                    </div>

                    {/* Quick Demo Option */}
                    <div className="auth-demo-box">
                        <div className="auth-demo-info">
                            <ShieldCheck size={18} className="demo-icon" />
                            <div>
                                <strong>Just testing?</strong>
                                <span>Instant 1-Click Guest Login to unlock all features.</span>
                            </div>
                        </div>
                        <button type="button" className="demo-btn" onClick={handleDemoLogin}>
                            Instant Guest Access <ArrowRight size={14} />
                        </button>
                    </div>

                    <div className="auth-divider">
                        <span>or continue with email</span>
                    </div>

                    {isSuccess ? (
                        <motion.div
                            className="auth-success-state"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <CheckCircle2 size={48} className="success-icon" />
                            <h3>Welcome to Student Hub!</h3>
                            <p>Unlocking your Academic & Career Studio...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form">
                            {mode === 'signup' && (
                                <>
                                    <div className="input-field">
                                        <label>Full Name</label>
                                        <div className="input-wrap">
                                            <User size={16} />
                                            <input
                                                type="text"
                                                placeholder="Alex Rivers"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="input-field">
                                        <label>Major / Field of Study</label>
                                        <div className="input-wrap">
                                            <GraduationCap size={16} />
                                            <select value={major} onChange={(e) => setMajor(e.target.value)}>
                                                <option value="Computer Science & AI">Computer Science & AI</option>
                                                <option value="Data Science & Engineering">Data Science & Engineering</option>
                                                <option value="Business & Finance">Business & Finance</option>
                                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                                <option value="Electrical Engineering">Electrical Engineering</option>
                                                <option value="Design & UX">Design & UX</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="input-field">
                                <label>Student Email (.edu or personal)</label>
                                <div className="input-wrap">
                                    <Mail size={16} />
                                    <input
                                        type="email"
                                        placeholder="student@university.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Password</label>
                                <div className="input-wrap">
                                    <Lock size={16} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-submit-btn">
                                {mode === 'signup' ? 'Create Free Account & Unlock' : 'Sign In & Unlock Features'} <ArrowRight size={16} />
                            </button>
                        </form>
                    )}

                    <div className="auth-footer">
                        {mode === 'signup' ? (
                            <p>
                                Already have an account?{' '}
                                <button type="button" onClick={() => setMode('login')}>
                                    Sign In
                                </button>
                            </p>
                        ) : (
                            <p>
                                New to Student Hub?{' '}
                                <button type="button" onClick={() => setMode('signup')}>
                                    Create Account
                                </button>
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
