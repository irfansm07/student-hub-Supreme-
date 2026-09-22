import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, openAuthModal } = useAuth()
    const { toast } = useToast()

    useEffect(() => {
        if (!isAuthenticated) {
            toast('Login Required: Please sign in to access Student Hub features.', 'error')
            openAuthModal()
        }
    }, [isAuthenticated, openAuthModal, toast])

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
