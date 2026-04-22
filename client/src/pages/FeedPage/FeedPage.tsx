import { useState } from 'react'
import { FilterBar } from '../../components/FilterBar/FilterBar'
import { PostCard } from '../../components/PostCard/PostCard'
import { PostForm } from '../../components/PostForm/PostForm'
import { addPost, deletePost, updatePost } from '../../store/feedSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { Post } from '../../types/post'
import './FeedPage.scss'

export function FeedPage() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const posts = useAppSelector((state) => state.feed.posts)
  const filters = useAppSelector((state) => state.feed.filters)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const filteredPosts = posts.filter((post) => {
    const matchesType = filters.type === 'Все' || post.type === filters.type
    const matchesDirection =
      filters.direction === 'Все' || post.direction === filters.direction

    return matchesType && matchesDirection
  })

  const handleOpenCreate = () => {
    setEditingPost(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (post: Post) => {
    setEditingPost(post)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setEditingPost(null)
    setIsFormOpen(false)
  }

  const handleSubmitPost = (values: {
    title: string
    content: string
    type: Post['type']
    direction: Post['direction']
  }) => {
    if (!user) {
      return
    }

    if (editingPost) {
      dispatch(
        updatePost({
          ...editingPost,
          ...values,
        }),
      )
      handleCloseForm()
      return
    }

    dispatch(
      addPost({
        id: crypto.randomUUID(),
        title: values.title,
        content: values.content,
        author: user.nickname,
        type: values.type,
        direction: values.direction,
        likes: 0,
        isLikedByUser: false,
      }),
    )

    handleCloseForm()
  }

  const handleDeletePost = (postId: string) => {
    const shouldDelete = window.confirm('Удалить этот пост?')

    if (!shouldDelete) {
      return
    }

    dispatch(deletePost(postId))
  }

  return (
    <section className="feed-page">
      <div className="feed-page__hero">
        <div>
          <p className="feed-page__eyebrow">Главная страница</p>
          <h1 className="feed-page__title">Добро пожаловать, {user?.nickname}</h1>
          <p className="feed-page__subtitle">
            Теперь лента умеет не только фильтровать посты и ставить лайки, но и
            создавать, редактировать и удалять ваши публикации.
          </p>
        </div>

        <button
          type="button"
          className="feed-page__create-button"
          onClick={handleOpenCreate}
        >
          Создать пост
        </button>
      </div>

      {isFormOpen && (
        <PostForm
          initialPost={editingPost}
          onSubmit={handleSubmitPost}
          onCancel={handleCloseForm}
        />
      )}

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
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isOwner={post.author === user?.nickname}
                onEdit={handleOpenEdit}
                onDelete={handleDeletePost}
              />
            ))
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