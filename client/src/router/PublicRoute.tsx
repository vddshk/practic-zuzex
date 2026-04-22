import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

type PublicRouteProps = {
  children: React.ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/feed" replace />
  }

  return children
}