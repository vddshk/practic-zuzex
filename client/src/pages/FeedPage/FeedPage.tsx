import { useAppSelector } from '../../store/hooks'
import './FeedPage.scss'

const mockPosts = [
  {
    id: '1',
    title: 'Как я организую frontend-архитектуру в небольших проектах',
    author: 'alex.dev',
    type: 'Контент',
    direction: 'Frontend',
    preview:
      'Разбираю базовую структуру папок, подход к компонентам, стилизации и работе с состоянием. Это удобная отправная точка для MVP.',
  },
  {
    id: '2',
    title: 'Ищем QA Engineer в pet-проект',
    author: 'hr.team',
    type: 'Вакансия',
    direction: 'QA',
    preview:
      'Нужен человек, который поможет выстроить базовые тест-кейсы, smoke-проверки и минимальный процесс контроля качества.',
  },
  {
    id: '3',
    title: 'Небольшой meetup по backend-разработке',
    author: 'node.group',
    type: 'Событие',
    direction: 'Backend',
    preview:
      'Поговорим про API, архитектуру модулей, аутентификацию и типичные ошибки при построении первых серверных приложений.',
  },
]

export function FeedPage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <section className="feed-page">
      <div className="feed-page__hero">
        <div>
          <p className="feed-page__eyebrow">Главная страница</p>
          <h1 className="feed-page__title">Добро пожаловать, {user?.nickname}</h1>
          <p className="feed-page__subtitle">
            Сейчас здесь mock-данные. Позже подключим настоящий backend, фильтры,
            создание постов, лайки и редактирование.
          </p>
        </div>

        <button type="button" className="feed-page__create-button">
          Создать пост
        </button>
      </div>

      <div className="feed-page__grid">
        <aside className="feed-page__sidebar">
          <div className="feed-page__panel">
            <h2 className="feed-page__panel-title">Фильтры</h2>
            <p className="feed-page__panel-text">Тип: Контент / Вакансия / Событие</p>
            <p className="feed-page__panel-text">
              Направление: Frontend / Backend / QA / Design
            </p>
          </div>

          <div className="feed-page__panel">
            <h2 className="feed-page__panel-title">Ваш профиль</h2>
            <p className="feed-page__panel-text">Никнейм: {user?.nickname}</p>
            <p className="feed-page__panel-text">Роль: {user?.role}</p>
          </div>
        </aside>

        <div className="feed-page__content">
          {mockPosts.map((post) => (
            <article key={post.id} className="feed-page__card">
              <div className="feed-page__card-meta">
                <span className="feed-page__badge">{post.type}</span>
                <span className="feed-page__direction">{post.direction}</span>
              </div>

              <h3 className="feed-page__card-title">{post.title}</h3>

              <p className="feed-page__card-author">Автор: {post.author}</p>

              <p className="feed-page__card-preview">{post.preview}</p>

              <div className="feed-page__card-footer">
                <button type="button" className="feed-page__secondary-button">
                  Открыть
                </button>

                <button type="button" className="feed-page__secondary-button">
                  Лайк
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}