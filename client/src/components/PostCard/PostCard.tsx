import { toggleLike } from '../../store/feedSlice'
import { useAppDispatch } from '../../store/hooks'
import type { Post } from '../../types/post'
import './PostCard.scss'

type PostCardProps = {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const dispatch = useAppDispatch()

  return (
    <article className="post-card">
      <div className="post-card__meta">
        <span className="post-card__badge">{post.type}</span>
        <span className="post-card__direction">{post.direction}</span>
      </div>

      <h3 className="post-card__title">{post.title}</h3>

      <p className="post-card__author">Автор: {post.author}</p>

      <p className="post-card__content">{post.content}</p>

      <div className="post-card__footer">
        <button
          type="button"
          className={`post-card__like-button ${post.isLikedByUser ? 'active' : ''}`}
          onClick={() => dispatch(toggleLike(post.id))}
        >
          {post.isLikedByUser ? 'Убрать лайк' : 'Поставить лайк'}
        </button>

        <span className="post-card__likes">Лайков: {post.likes}</span>
      </div>
    </article>
  )
}