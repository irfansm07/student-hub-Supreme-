import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, openAuthModal } = useAuth()
    const { push } = useToast()

    useEffect(() => {
        if (!isAuthenticated) {
            push('Login Required: Please sign in to access Student Hub features.')
            openAuthModal()
        }
    }, [isAuthenticated, openAuthModal, push])

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
