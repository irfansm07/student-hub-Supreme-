import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export interface UserProfile {
    name: string
    email: string
    major: string
}

interface AuthContextType {
    user: UserProfile | null
    isAuthenticated: boolean
    isAuthModalOpen: boolean
    login: (user: UserProfile) => void
    logout: () => void
    openAuthModal: () => void
    closeAuthModal: () => void
    requireAuth: (callback?: () => void) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'student_hub_user_v1'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    })

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    const login = (userData: UserProfile) => {
        setUser(userData)
        setIsAuthModalOpen(false)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
        } catch (e) {
            console.error('Failed to save auth state:', e)
        }
    }

    const logout = () => {
        setUser(null)
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            console.error('Failed to remove auth state:', e)
        }
    }

    const openAuthModal = () => setIsAuthModalOpen(true)
    const closeAuthModal = () => setIsAuthModalOpen(false)

    const requireAuth = (callback?: () => void): boolean => {
        if (user) {
            if (callback) callback()
            return true
        } else {
            setIsAuthModalOpen(true)
            return false
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAuthModalOpen,
                login,
                logout,
                openAuthModal,
                closeAuthModal,
                requireAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
