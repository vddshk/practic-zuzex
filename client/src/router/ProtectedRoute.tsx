import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isAuthChecked } = useAppSelector((state) => state.auth)

  if (!isAuthChecked) {
    return <div style={{ padding: '24px' }}>Загрузка...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}