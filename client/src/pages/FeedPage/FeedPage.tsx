import { Link, useNavigate } from 'react-router-dom'
import { clearAuthUser } from '../../utils/authStorage'
import { logout } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

export function FeedPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    clearAuthUser()
    navigate('/')
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Главная страница</h1>
      <p>Здесь будет лента постов.</p>

      <div style={{ marginTop: '16px' }}>
        <p>Вы вошли как: {user?.nickname}</p>
        <p>Роль: {user?.role}</p>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Link to={`/profile/${user?.id}`}>Открыть профиль</Link>
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  )
}