import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/AppLayout/AppLayout'
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
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}