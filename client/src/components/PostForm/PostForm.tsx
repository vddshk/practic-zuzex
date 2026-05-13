import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Post } from '../../types/post'
import './PostForm.scss'

type PostFormProps = {
  initialPost: Post | null
  onSubmit: (values: {
    title: string
    content: string
    type: Post['type']
    direction: Post['direction']
    previewImage: string
  }) => void
  onCancel: () => void
  onDelete?: () => void
}

export function PostForm({
  initialPost,
  onSubmit,
  onCancel,
  onDelete,
}: PostFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<Post['type']>('Контент')
  const [direction, setDirection] = useState<Post['direction']>('Frontend')
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write')

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title ?? '')
      setContent(initialPost.content ?? '')
      setType(initialPost.type ?? 'Контент')
      setDirection(initialPost.direction ?? 'Frontend')
      setPreviewImage(initialPost.previewImage ?? '')
      setErrors([])
      setEditorTab('write')
      return
    }

    setTitle('')
    setContent('')
    setType('Контент')
    setDirection('Frontend')
    setPreviewImage('')
    setErrors([])
    setEditorTab('write')
  }, [initialPost])

  const validateImageUrl = (value: string) => {
    if (!value.trim()) {
      return true
    }

    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const insertAtCursor = (before: string, after = '') => {
    const textarea = textareaRef.current

    if (!textarea) {
      setContent((prev) => `${prev}${before}${after}`)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.slice(start, end)

    const nextValue =
      content.slice(0, start) +
      before +
      selectedText +
      after +
      content.slice(end)

    setContent(nextValue)

    requestAnimationFrame(() => {
      textarea.focus()

      const cursorStart = start + before.length
      const cursorEnd = cursorStart + selectedText.length

      if (selectedText.length > 0) {
        textarea.setSelectionRange(cursorStart, cursorEnd)
      } else {
        textarea.setSelectionRange(cursorStart, cursorStart)
      }
    })
  }

  const insertLineTemplate = (template: string) => {
    const textarea = textareaRef.current

    if (!textarea) {
      setContent((prev) => `${prev}\n${template}`)
      return
    }

    const start = textarea.selectionStart
    const nextValue = content.slice(0, start) + template + content.slice(start)

    setContent(nextValue)

    requestAnimationFrame(() => {
      textarea.focus()
      const cursor = start + template.length
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

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

    if (!validateImageUrl(previewImage)) {
      nextErrors.push('Фото-превью должно быть корректной ссылкой')
    }

    setErrors(nextErrors)

    if (nextErrors.length > 0) {
      return
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      type,
      direction,
      previewImage: previewImage.trim(),
    })
  }

  const isEditing = Boolean(initialPost)

  return (
    <section className="post-form">
      <div className="post-form__header">
        <p className="post-form__eyebrow">
          {isEditing ? 'Редактирование' : 'Создание'}
        </p>
        <h2 className="post-form__title">
          {isEditing ? 'Редактировать пост' : 'Создать пост'}
        </h2>
      </div>

      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((error) => (
            <p key={error} className="error-text">
              {error}
            </p>
          ))}
        </div>
      )}

      <form className="post-form__body" onSubmit={handleSubmit}>
        <div className="post-form__field">
          <label className="post-form__label" htmlFor="post-title">
            Заголовок
          </label>
          <input
            id="post-title"
            className="post-form__input"
            type="text"
            value={title}
            placeholder="Введите заголовок"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="post-form__field">
          <label className="post-form__label">Текст</label>

          <div className="post-form__editor">
            <div className="post-form__editor-topbar">
              <div className="post-form__tabs">
                <button
                  type="button"
                  className={`post-form__tab ${editorTab === 'write' ? 'active' : ''}`}
                  onClick={() => setEditorTab('write')}
                >
                  Редактор
                </button>
                <button
                  type="button"
                  className={`post-form__tab ${editorTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setEditorTab('preview')}
                >
                  Превью
                </button>
              </div>

              <div className="post-form__toolbar">
                <button
                  type="button"
                  className="post-form__tool"
                  onClick={() => insertLineTemplate('# ')}
                >
                  H1
                </button>
                <button
                  type="button"
                  className="post-form__tool"
                  onClick={() => insertAtCursor('**', '**')}
                >
                  B
                </button>
                <button
                  type="button"
                  className="post-form__tool"
                  onClick={() => insertAtCursor('*', '*')}
                >
                  I
                </button>
                <button
                  type="button"
                  className="post-form__tool"
                  onClick={() => insertLineTemplate('- ')}
                >
                  • List
                </button>
                <button
                  type="button"
                  className="post-form__tool"
                  onClick={() => insertAtCursor('[Ссылка](', ')')}
                >
                  Link
                </button>
                <button
                  type="button"
                  className="post-form__tool"
                  onClick={() => insertAtCursor('```js\n', '\n```')}
                >
                  Code
                </button>
              </div>
            </div>

            {editorTab === 'write' ? (
              <textarea
                ref={textareaRef}
                id="post-content"
                className="post-form__textarea post-form__textarea--editor"
                rows={12}
                value={content}
                placeholder={'Поддерживается Markdown.\n\nНапример:\n# Заголовок\n**жирный**\n- список'}
                onChange={(event) => setContent(event.target.value)}
              />
            ) : (
              <div className="post-form__markdown-preview">
                {content.trim() ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="post-form__preview-empty">
                    Здесь появится предпросмотр Markdown.
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="post-form__hint">
            Поддерживается Markdown: заголовки, списки, ссылки, код, таблицы.
          </p>
        </div>

        <div className="post-form__field">
          <label className="post-form__label" htmlFor="post-preview-image">
            Фото-превью (URL)
          </label>
          <input
            id="post-preview-image"
            className="post-form__input"
            type="text"
            value={previewImage}
            placeholder="https://example.com/image.jpg"
            onChange={(event) => setPreviewImage(event.target.value)}
          />
        </div>

        <div className="post-form__grid">
          <div className="post-form__field">
            <label className="post-form__label" htmlFor="post-type">
              Тип поста
            </label>
            <select
              id="post-type"
              className="post-form__input"
              value={type}
              onChange={(event) => setType(event.target.value as Post['type'])}
            >
              <option value="Контент">Контент</option>
              <option value="Событие">Событие</option>
              <option value="Вакансия">Вакансия</option>
            </select>
          </div>

          <div className="post-form__field">
            <label className="post-form__label" htmlFor="post-direction">
              Направление
            </label>
            <select
              id="post-direction"
              className="post-form__input"
              value={direction}
              onChange={(event) =>
                setDirection(event.target.value as Post['direction'])
              }
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="QA">QA</option>
              <option value="Design">Design</option>
              <option value="Management">Management</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        {previewImage.trim() && (
          <div className="post-form__preview-block">
            <p className="post-form__label">Предпросмотр изображения</p>
            <img
              className="post-form__preview-image"
              src={previewImage}
              alt="Предпросмотр поста"
            />
          </div>
        )}

        <div className="post-form__actions">
          {isEditing && onDelete && (
            <button
              type="button"
              className="post-form__danger"
              onClick={onDelete}
            >
              Удалить пост
            </button>
          )}

          <button
            type="button"
            className="post-form__secondary"
            onClick={onCancel}
          >
            Отмена
          </button>

          <button type="submit" className="post-form__primary">
            {isEditing ? 'Сохранить изменения' : 'Создать пост'}
          </button>
        </div>
      </form>
    </section>
  )
}