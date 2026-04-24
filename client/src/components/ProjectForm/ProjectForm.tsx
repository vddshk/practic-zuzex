import { useEffect, useState } from 'react'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import type { PortfolioProject } from '../../types/profile'
import './ProjectForm.scss'

type ProjectFormProps = {
  initialProject?: PortfolioProject | null
  onSubmit: (values: {
    title: string
    description: string
    links: string[]
  }) => void
  onCancel: () => void
}

export function ProjectForm({ initialProject, onSubmit, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [links, setLinks] = useState(['', '', ''])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title)
      setDescription(initialProject.description ?? '')
      setLinks([
        initialProject.links[0] ?? '',
        initialProject.links[1] ?? '',
        initialProject.links[2] ?? '',
      ])
      return
    }

    setTitle('')
    setDescription('')
    setLinks(['', '', ''])
  }, [initialProject])

  const handleChangeLink = (index: number, value: string) => {
    setErrors([])
    setLinks((prev) => prev.map((link, i) => (i === index ? value : link)))
  }

  const isValidUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const validate = () => {
    const nextErrors: string[] = []

    if (!title.trim()) {
      nextErrors.push('Введите название проекта')
    }

    if (title.trim().length > 100) {
      nextErrors.push('Название проекта не должно превышать 100 символов')
    }

    const filledLinks = links.map((link) => link.trim()).filter(Boolean)

    for (const link of filledLinks) {
      if (!isValidUrl(link)) {
        nextErrors.push('Все ссылки должны быть корректными URL')
        break
      }
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
      description: description.trim(),
      links: links.map((link) => link.trim()).filter(Boolean),
    })
  }

  return (
    <section className="project-form">
      <div className="project-form__header">
        <p className="project-form__eyebrow">
          {initialProject ? 'Редактирование проекта' : 'Новый проект'}
        </p>
        <h2 className="project-form__title">
          {initialProject ? 'Редактировать проект' : 'Добавить проект'}
        </h2>
      </div>

      <ErrorMessage messages={errors} />

      <form className="project-form__body" onSubmit={handleSubmit}>
        <div className="project-form__field">
          <label className="project-form__label" htmlFor="projectTitle">
            Название проекта
          </label>
          <input
            id="projectTitle"
            className="project-form__input"
            value={title}
            placeholder="Введите название проекта"
            onChange={(e) => {
              setErrors([])
              setTitle(e.target.value)
            }}
          />
        </div>

        <div className="project-form__field">
          <label className="project-form__label" htmlFor="projectDescription">
            Описание
          </label>
          <textarea
            id="projectDescription"
            className="project-form__textarea"
            value={description}
            placeholder="Кратко опишите проект"
            rows={5}
            onChange={(e) => {
              setErrors([])
              setDescription(e.target.value)
            }}
          />
        </div>

        <div className="project-form__field">
          <label className="project-form__label">Ссылки на проект</label>

          <div className="project-form__links">
            <input
              className="project-form__input"
              value={links[0]}
              placeholder="https://github.com/..."
              onChange={(e) => handleChangeLink(0, e.target.value)}
            />
            <input
              className="project-form__input"
              value={links[1]}
              placeholder="https://demo.example.com"
              onChange={(e) => handleChangeLink(1, e.target.value)}
            />
            <input
              className="project-form__input"
              value={links[2]}
              placeholder="https://another-link.example.com"
              onChange={(e) => handleChangeLink(2, e.target.value)}
            />
          </div>
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
            {initialProject ? 'Сохранить проект' : 'Добавить проект'}
          </button>
        </div>
      </form>
    </section>
  )
}