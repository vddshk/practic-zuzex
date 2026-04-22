import { NavLink, useNavigate } from 'react-router-dom'
import { clearAuthUser } from '../../utils/authStorage'
import { logout } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import './AppHeader.scss'

export function AppHeader() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    clearAuthUser()
    navigate('/')
  }

  const profileLink = user ? `/profile/${user.id}` : '/feed'

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__brand">
          <div className="app-header__logo">P</div>

          <div>
            <p className="app-header__title">Practice Social App</p>
            <p className="app-header__subtitle">Учебная социальная платформа</p>
          </div>
        </div>

        <nav className="app-header__nav">
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `app-header__link ${isActive ? 'active' : ''}`
            }
          >
            Лента
          </NavLink>

          <NavLink
            to={profileLink}
            className={({ isActive }) =>
              `app-header__link ${isActive ? 'active' : ''}`
            }
          >
            Профиль
          </NavLink>
        </nav>

        <div className="app-header__actions">
          <div className="app-header__user">
            <span className="app-header__nickname">{user?.nickname}</span>
            <span className="app-header__role">{user?.role}</span>
          </div>

          <button
            type="button"
            className="app-header__logout"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  )
}