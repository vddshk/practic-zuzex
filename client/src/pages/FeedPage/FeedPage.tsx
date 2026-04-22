import { FilterBar } from '../../components/FilterBar/FilterBar'
import { PostCard } from '../../components/PostCard/PostCard'
import { useAppSelector } from '../../store/hooks'
import './FeedPage.scss'

export function FeedPage() {
  const user = useAppSelector((state) => state.auth.user)
  const posts = useAppSelector((state) => state.feed.posts)
  const filters = useAppSelector((state) => state.feed.filters)

  const filteredPosts = posts.filter((post) => {
    const matchesType = filters.type === 'Все' || post.type === filters.type
    const matchesDirection =
      filters.direction === 'Все' || post.direction === filters.direction

    return matchesType && matchesDirection
  })

  return (
    <section className="feed-page">
      <div className="feed-page__hero">
        <div>
          <p className="feed-page__eyebrow">Главная страница</p>
          <h1 className="feed-page__title">Добро пожаловать, {user?.nickname}</h1>
          <p className="feed-page__subtitle">
            Сейчас мы уже храним ленту в Redux. Следующим шагом добавим создание,
            редактирование и удаление постов.
          </p>
        </div>

        <button type="button" className="feed-page__create-button">
          Создать пост
        </button>
      </div>

      <FilterBar />

      <div className="feed-page__grid">
        <aside className="feed-page__sidebar">
          <div className="feed-page__panel">
            <h2 className="feed-page__panel-title">Фильтры</h2>
            <p className="feed-page__panel-text">Тип: {filters.type}</p>
            <p className="feed-page__panel-text">Направление: {filters.direction}</p>
          </div>

          <div className="feed-page__panel">
            <h2 className="feed-page__panel-title">Ваш профиль</h2>
            <p className="feed-page__panel-text">Никнейм: {user?.nickname}</p>
            <p className="feed-page__panel-text">Роль: {user?.role}</p>
            <p className="feed-page__panel-text">Постов в ленте: {filteredPosts.length}</p>
          </div>
        </aside>

        <div className="feed-page__content">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="feed-page__empty">
              <h3 className="feed-page__empty-title">Ничего не найдено</h3>
              <p className="feed-page__empty-text">
                Попробуй изменить фильтры и посмотреть другие посты.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}