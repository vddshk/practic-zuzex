import type { Post } from '../../types/post'
import './PostCard.scss'

type PostCardProps = {
  post: Post
  isOwner: boolean
  onEdit: (post: Post) => void
  onDelete: (postId: string) => void
  onToggleLike: (post: Post) => void
}

export function PostCard({
  post,
  isOwner,
  onEdit,
  onDelete,
  onToggleLike,
}: PostCardProps) {
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
        <div className="post-card__left-actions">
          <button
            type="button"
            className={`post-card__like-button ${post.isLikedByUser ? 'active' : ''}`}
            onClick={() => onToggleLike(post)}
          >
            {post.isLikedByUser ? 'Убрать лайк' : 'Поставить лайк'}
          </button>

          {isOwner && (
            <>
              <button
                type="button"
                className="post-card__action-button"
                onClick={() => onEdit(post)}
              >
                Редактировать
              </button>

              <button
                type="button"
                className="post-card__delete-button"
                onClick={() => onDelete(post.id)}
              >
                Удалить
              </button>
            </>
          )}
        </div>

        <span className="post-card__likes">Лайков: {post.likes}</span>
      </div>
    </article>
  )
}