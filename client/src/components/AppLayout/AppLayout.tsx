import { Outlet } from 'react-router-dom'
import { AppHeader } from '../AppHeader/AppHeader'
import './AppLayout.scss'

export function AppLayout() {
  return (
    <div className="app-layout">
      <AppHeader />

      <main className="app-layout__content">
        <div className="app-layout__container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}