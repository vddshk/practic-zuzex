import { Link, useParams } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

export function ProfilePage() {
  const { id } = useParams()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <div style={{ padding: '24px' }}>
      <h1>Профиль пользователя</h1>
      <p>ID из URL: {id}</p>

      <div style={{ marginTop: '16px' }}>
        <p>Никнейм: {user?.nickname}</p>
        <p>Роль: {user?.role}</p>
        {user?.firstName && <p>Имя: {user.firstName}</p>}
        {user?.lastName && <p>Фамилия: {user.lastName}</p>}
        {user?.email && <p>Email: {user.email}</p>}
      </div>

      <div style={{ marginTop: '16px' }}>
        <Link to="/feed">Назад в ленту</Link>
      </div>
    </div>
  )
}