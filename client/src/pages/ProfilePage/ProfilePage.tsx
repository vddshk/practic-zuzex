import { useParams } from 'react-router-dom'

export function ProfilePage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>ID пользователя: {id}</p>
    </div>
  )
}