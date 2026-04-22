import { useEffect, useState } from 'react'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import type { Post, PostDirection, PostType } from '../../types/post'
import './PostForm.scss'

type PostFormProps = {
  initialPost?: Post | null
  onSubmit: (values: {
    title: string
    content: string
    type: PostType
    direction: PostDirection
  }) => void
  onCancel: () => void
}

const typeOptions: PostType[] = ['Контент', 'Событие', 'Вакансия']
const directionOptions: PostDirection[] = [
  'Frontend',
  'Backend',
  'QA',
  'Design',
  'Management',
  'HR',
]

export function PostForm({ initialPost, onSubmit, onCancel }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<PostType>('Контент')
  const [direction, setDirection] = useState<PostDirection>('Frontend')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title)
      setContent(initialPost.content)
      setType(initialPost.type)
      setDirection(initialPost.direction)
      return
    }

    setTitle('')
    setContent('')
    setType('Контент')
    setDirection('Frontend')
  }, [initialPost])

  const validate = () => {
    const nextErrors: string[] = []

    if (!title.trim()) {
      nextErrors.push('Введите заголовок')
    }

    if (title.trim().length > 100) {
      nextErrors.push('Заголовок не должен превышать 100 символов')
    }

    if (!content.trim()) {
      nextErrors.push('Введите текст поста')
    }

    if (content.trim().length > 20000) {
      nextErrors.push('Текст поста не должен превышать 20000 символов')
    }

    setErrors(nextErrors)
    return nextErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validate()

    if (!isValid) {
      return
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      direction,
    })
  }

  return (
    <section className="post-form">
      <div className="post-form__header">
        <div>
          <p className="post-form__eyebrow">
            {initialPost ? 'Редактирование' : 'Создание'}
          </p>
          <h2 className="post-form__title">
            {initialPost ? 'Редактировать пост' : 'Создать пост'}
          </h2>
        </div>
      </div>

      <ErrorMessage messages={errors} />

      <form className="post-form__body" onSubmit={handleSubmit}>
        <div className="post-form__field">
          <label className="post-form__label" htmlFor="postTitle">
            Заголовок
          </label>
          <input
            id="postTitle"
            className="post-form__input"
            value={title}
            onChange={(e) => {
              setErrors([])
              setTitle(e.target.value)
            }}
            placeholder="Введите заголовок"
          />
        </div>

        <div className="post-form__field">
          <label className="post-form__label" htmlFor="postContent">
            Текст
          </label>
          <textarea
            id="postContent"
            className="post-form__textarea"
            value={content}
            onChange={(e) => {
              setErrors([])
              setContent(e.target.value)
            }}
            placeholder="Введите текст поста"
            rows={8}
          />
        </div>

        <div className="post-form__grid">
          <div className="post-form__field">
            <label className="post-form__label" htmlFor="postType">
              Тип поста
            </label>
            <select
              id="postType"
              className="post-form__input"
              value={type}
              onChange={(e) => setType(e.target.value as PostType)}
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="post-form__field">
            <label className="post-form__label" htmlFor="postDirection">
              Направление
            </label>
            <select
              id="postDirection"
              className="post-form__input"
              value={direction}
              onChange={(e) => setDirection(e.target.value as PostDirection)}
            >
              {directionOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="post-form__actions">
          <button type="button" className="post-form__secondary" onClick={onCancel}>
            Отмена
          </button>

          <button type="submit" className="post-form__primary">
            {initialPost ? 'Сохранить изменения' : 'Создать пост'}
          </button>
        </div>
      </form>
    </section>
  )
}