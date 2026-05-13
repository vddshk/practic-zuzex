import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Post } from '../../types/post'
import './PostCard.scss'

type PostCardProps = {
  post: Post
  isOwner: boolean
  onEdit: (post: Post) => void
  onToggleLike: (post: Post) => void
}

const PREVIEW_LIMIT = 500

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[([^\]]+)\]\((.*?)\)/g, '$1')
    .replace(/[*_~#>-]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function PostCard({
  post,
  isOwner,
  onEdit,
  onToggleLike,
}: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const plainTextContent = useMemo(() => stripMarkdown(post.content), [post.content])
  const shouldTruncate = plainTextContent.length > PREVIEW_LIMIT

  const previewText = useMemo(() => {
    if (!shouldTruncate) {
      return plainTextContent
    }

    return `${plainTextContent.slice(0, PREVIEW_LIMIT)}...`
  }, [plainTextContent, shouldTruncate])

  return (
    <article className="post-card">
      <div className="post-card__topbar">
        <div className="post-card__meta">
          <span className="post-card__badge">{post.type}</span>
          <span className="post-card__direction">{post.direction}</span>
        </div>

        {isOwner && (
          <button
            type="button"
            className="post-card__menu-button"
            onClick={() => onEdit(post)}
            aria-label="Открыть редактирование поста"
            title="Редактировать пост"
          >
            ⋯
          </button>
        )}
      </div>

      <h3 className="post-card__title">{post.title}</h3>

      <p className="post-card__author">
        Автор:{' '}
        <Link className="post-card__author-link" to={`/profile/${post.authorId}`}>
          {post.author}
        </Link>
      </p>

      {post.previewImage && (
        <img
          className="post-card__image"
          src={post.previewImage}
          alt={post.title}
        />
      )}

      {shouldTruncate && !isExpanded ? (
        <p className="post-card__content">{previewText}</p>
      ) : (
        <div className="post-card__markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      )}

      {shouldTruncate && (
        <button
          type="button"
          className="post-card__expand"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      )}

      <div className="post-card__footer">
        <div className="post-card__left-actions">
          <button
            type="button"
            className={`post-card__like-button ${post.isLikedByUser ? 'active' : ''}`}
            onClick={() => onToggleLike(post)}
          >
            {post.isLikedByUser ? 'Убрать лайк' : 'Поставить лайк'}
          </button>
        </div>

        <span className="post-card__likes">Лайков: {post.likes}</span>
      </div>
    </article>
  )
}