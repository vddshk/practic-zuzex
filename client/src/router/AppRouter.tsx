import { Routes, Route } from 'react-router-dom'
import { AuthPage } from '../pages/AuthPage/AuthPage'
import { FeedPage } from '../pages/FeedPage/FeedPage'
import { ProfilePage } from '../pages/ProfilePage/ProfilePage'
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}