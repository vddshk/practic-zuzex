import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

type PublicRouteProps = {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isAuthChecked } = useAppSelector((state) => state.auth)

  if (!isAuthChecked) {
    return <div style={{ padding: '24px' }}>Загрузка...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  return children
}