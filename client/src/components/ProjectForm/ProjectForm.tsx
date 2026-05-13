import { useEffect, useState } from 'react'
import type { PortfolioProject } from '../../types/profile'
import './ProjectForm.scss'

type ProjectFormProps = {
  initialProject: PortfolioProject | null
  onSubmit: (values: {
    title: string
    description: string
    links: string[]
    previewImage: string
  }) => void
  onCancel: () => void
}

export function ProjectForm({
  initialProject,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState<string[]>([''])
  const [previewImage, setPreviewImage] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title ?? '')
      setDescription(initialProject.description ?? '')
      setLinks(
        initialProject.links && initialProject.links.length > 0
          ? initialProject.links
          : [''],
      )
      setPreviewImage(initialProject.previewImage ?? '')
      setErrors([])
      return
    }

    setTitle('')
    setDescription('')
    setLinks([''])
    setPreviewImage('')
    setErrors([])
  }, [initialProject])

  const handleChangeLink = (index: number, value: string) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? value : link)))
  }

  const handleAddLink = () => {
    if (links.length >= 3) {
      return
    }

    setLinks((prev) => [...prev, ''])
  }

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => {
      const nextLinks = prev.filter((_, i) => i !== index)
      return nextLinks.length > 0 ? nextLinks : ['']
    })
  }

  const validateUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: string[] = []

    if (!title.trim()) {
      nextErrors.push('Введите название проекта')
    }

    if (title.trim().length > 100) {
      nextErrors.push('Название проекта не должно превышать 100 символов')
    }

    const normalizedLinks = links
      .map((link) => link.trim())
      .filter((link) => link.length > 0)

    const hasInvalidLink = normalizedLinks.some((link) => !validateUrl(link))

    if (hasInvalidLink) {
      nextErrors.push('Все ссылки должны быть корректными URL')
    }

    if (normalizedLinks.length > 3) {
      nextErrors.push('Можно добавить не более 3 ссылок')
    }

    if (previewImage.trim() && !validateUrl(previewImage.trim())) {
      nextErrors.push('Фото-превью должно быть корректной ссылкой')
    }

    setErrors(nextErrors)

    if (nextErrors.length > 0) {
      return
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      links: normalizedLinks,
      previewImage: previewImage.trim(),
    })
  }

  const isEditing = Boolean(initialProject)

  return (
    <section className="project-form">
      <div className="project-form__header">
        <p className="project-form__eyebrow">Портфолио</p>
        <h2 className="project-form__title">
          {isEditing ? 'Редактирование проекта' : 'Добавление проекта'}
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

      <form className="project-form__body" onSubmit={handleSubmit}>
        <div className="project-form__field">
          <label className="project-form__label" htmlFor="project-title">
            Название проекта
          </label>
          <input
            id="project-title"
            className="project-form__input"
            type="text"
            value={title}
            placeholder="Введите название проекта"
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="project-form__field">
          <label className="project-form__label" htmlFor="project-description">
            Описание
          </label>
          <textarea
            id="project-description"
            className="project-form__textarea"
            rows={4}
            value={description}
            placeholder="Кратко опишите проект"
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="project-form__field">
          <label className="project-form__label" htmlFor="project-preview-image">
            Фото-превью (URL)
          </label>
          <input
            id="project-preview-image"
            className="project-form__input"
            type="text"
            value={previewImage}
            placeholder="https://example.com/project.jpg"
            onChange={(event) => setPreviewImage(event.target.value)}
          />
        </div>

        {previewImage.trim() && (
          <div className="project-form__preview-block">
            <p className="project-form__label">Предпросмотр изображения</p>
            <img
              className="project-form__preview-image"
              src={previewImage}
              alt="Предпросмотр проекта"
            />
          </div>
        )}

        <div className="project-form__field">
          <label className="project-form__label">Ссылки</label>

          <div className="project-form__links">
            {links.map((link, index) => (
              <div key={index} className="project-form__link-row">
                <input
                  className="project-form__input"
                  type="text"
                  value={link}
                  placeholder="https://github.com/..."
                  onChange={(event) => handleChangeLink(index, event.target.value)}
                />

                <button
                  type="button"
                  className="project-form__link-remove"
                  onClick={() => handleRemoveLink(index)}
                  disabled={links.length === 1 && !links[0].trim()}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          {links.length < 3 && (
            <button
              type="button"
              className="project-form__link-add"
              onClick={handleAddLink}
            >
              Добавить ссылку
            </button>
          )}
        </div>

        <div className="project-form__actions">
          <button
            type="button"
            className="project-form__secondary"
            onClick={onCancel}
          >
            Отмена
          </button>

          <button type="submit" className="project-form__primary">
            {isEditing ? 'Сохранить изменения' : 'Добавить проект'}
          </button>
        </div>
      </form>
    </section>
  )
}