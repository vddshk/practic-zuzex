import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import './ProfilePage.scss'

const mockProjects = [
  {
    id: '1',
    title: 'WireHire Frontend MVP',
    description:
      'Интерфейс для работы с кандидатами, тестами и регистрациями. Первый учебный MVP для практики React.',
    links: ['GitHub', 'Demo'],
  },
  {
    id: '2',
    title: 'Auth Practice App',
    description:
      'Учебный модуль авторизации с ролями, Redux-состоянием и защищёнными маршрутами.',
    links: ['GitHub'],
  },
]

export function ProfilePage() {
  const { id } = useParams()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <section className="profile-page">
      <div className="profile-page__header">
        <div className="profile-page__avatar">
          {user?.nickname?.slice(0, 1).toUpperCase()}
        </div>

        <div className="profile-page__info">
          <p className="profile-page__eyebrow">Профиль пользователя</p>
          <h1 className="profile-page__title">{user?.nickname}</h1>
          <p className="profile-page__role">{user?.role}</p>
          <p className="profile-page__meta">ID из URL: {id}</p>
        </div>

        <div className="profile-page__actions">
          <button type="button" className="profile-page__primary-button">
            Редактировать профиль
          </button>

          <button type="button" className="profile-page__secondary-button">
            Добавить проект
          </button>
        </div>
      </div>

      <div className="profile-page__grid">
        <aside className="profile-page__sidebar">
          <div className="profile-page__panel">
            <h2 className="profile-page__panel-title">Основная информация</h2>
            {user?.firstName && (
              <p className="profile-page__panel-text">Имя: {user.firstName}</p>
            )}
            {user?.lastName && (
              <p className="profile-page__panel-text">Фамилия: {user.lastName}</p>
            )}
            {user?.email && (
              <p className="profile-page__panel-text">Email: {user.email}</p>
            )}
            <p className="profile-page__panel-text">Роль: {user?.role}</p>
          </div>

          <div className="profile-page__panel">
            <h2 className="profile-page__panel-title">О профиле</h2>
            <p className="profile-page__panel-text">
              Здесь позже появятся редактирование профиля, описание пользователя,
              место работы и полноценный блок портфолио.
            </p>
          </div>
        </aside>

        <div className="profile-page__content">
          <h2 className="profile-page__section-title">Портфолио</h2>

          <div className="profile-page__projects">
            {mockProjects.map((project) => (
              <article key={project.id} className="profile-page__project-card">
                <h3 className="profile-page__project-title">{project.title}</h3>
                <p className="profile-page__project-description">
                  {project.description}
                </p>

                <div className="profile-page__project-links">
                  {project.links.map((link) => (
                    <span key={link} className="profile-page__project-link">
                      {link}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}