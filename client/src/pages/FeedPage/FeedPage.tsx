import { useEffect, useState } from 'react'
import {
  createPost as createPostRequest,
  deletePost as deletePostRequest,
  fetchPosts,
  likePost,
  unlikePost,
  updatePost as updatePostRequest,
} from '../../api/postsApi'
import { FilterBar } from '../../components/FilterBar/FilterBar'
import { PostCard } from '../../components/PostCard/PostCard'
import { PostForm } from '../../components/PostForm/PostForm'
import {
  addPost,
  deletePost,
  setPosts,
  updatePost,
} from '../../store/feedSlice'
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await fetchPosts({
          type: filters.type,
          direction: filters.direction,
        })

        dispatch(setPosts(data))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить посты')
      } finally {
        setIsLoading(false)
      }
    }

    void loadPosts()
  }, [dispatch, filters.type, filters.direction])

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

  const handleSubmitPost = async (values: {
    title: string
    content: string
    type: Post['type']
    direction: Post['direction']
  }) => {
    try {
      setError('')

      if (editingPost) {
        const updatedPost = await updatePostRequest(editingPost.id, values)
        dispatch(updatePost(updatedPost))
        handleCloseForm()
        return
      }

      const createdPost = await createPostRequest(values)
      dispatch(addPost(createdPost))
      handleCloseForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить пост')
    }
  }

  const handleDeletePost = async (postId: string) => {
    const shouldDelete = window.confirm('Удалить этот пост?')

    if (!shouldDelete) {
      return
    }

    try {
      setError('')
      await deletePostRequest(postId)
      dispatch(deletePost(postId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить пост')
    }
  }

  const handleToggleLike = async (post: Post) => {
    try {
      setError('')

      const updatedPost = post.isLikedByUser
        ? await unlikePost(post.id)
        : await likePost(post.id)

      dispatch(updatePost(updatedPost))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить лайк')
    }
  }

  return (
    <section className="feed-page">
      <div className="feed-page__hero">
        <div>
          <p className="feed-page__eyebrow">Главная страница</p>
          <h1 className="feed-page__title">Добро пожаловать, {user?.nickname}</h1>
          <p className="feed-page__subtitle">
            Теперь лента работает через backend API: посты загружаются с сервера,
            создаются, редактируются, удаляются и лайкаются по-настоящему.
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

      {error && (
        <div className="feed-page__empty">
          <h3 className="feed-page__empty-title">Ошибка</h3>
          <p className="feed-page__empty-text">{error}</p>
        </div>
      )}

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
            <p className="feed-page__panel-text">Постов в ленте: {posts.length}</p>
          </div>
        </aside>

        <div className="feed-page__content">
          {isLoading ? (
            <div className="feed-page__empty">
              <h3 className="feed-page__empty-title">Загрузка</h3>
              <p className="feed-page__empty-text">Подождите, посты загружаются.</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isOwner={post.author === user?.nickname}
                onEdit={handleOpenEdit}
                onDelete={handleDeletePost}
                onToggleLike={handleToggleLike}
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