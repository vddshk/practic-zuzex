import { Route, Routes } from 'react-router-dom'
import { AuthPage } from '../pages/AuthPage/AuthPage'
import { FeedPage } from '../pages/FeedPage/FeedPage'
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage'
import { ProfilePage } from '../pages/ProfilePage/ProfilePage'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}