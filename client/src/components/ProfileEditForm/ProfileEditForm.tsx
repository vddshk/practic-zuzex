import { useEffect, useState } from 'react'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage'
import { InputField } from '../InputField/InputField'
import { RoleSelector } from '../RoleSelector/RoleSelector'
import type { UserRole } from '../../types/auth'
import type { UserProfile } from '../../types/profile'
import './ProfileEditForm.scss'

type ProfileEditFormProps = {
  profile: UserProfile
  onSubmit: (values: {
    firstName: string
    lastName: string
    nickname: string
    role: UserRole
    description: string
    workplace: string
  }) => void
  onCancel: () => void
}

export function ProfileEditForm({
  profile,
  onSubmit,
  onCancel,
}: ProfileEditFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [description, setDescription] = useState('')
  const [workplace, setWorkplace] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    setFirstName(profile.firstName)
    setLastName(profile.lastName)
    setNickname(profile.nickname)
    setRole(profile.role)
    setDescription(profile.description)
    setWorkplace(profile.workplace)
  }, [profile])

  const validate = () => {
    const nextErrors: string[] = []

    if (!firstName.trim()) {
      nextErrors.push('Введите имя')
    }

    if (!lastName.trim()) {
      nextErrors.push('Введите фамилию')
    }

    if (!nickname.trim()) {
      nextErrors.push('Введите никнейм')
    }

    if (!role) {
      nextErrors.push('Выберите роль')
    }

    setErrors(nextErrors)
    return nextErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validate()

    if (!isValid || !role) {
      return
    }

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nickname: nickname.trim(),
      role,
      description: description.trim(),
      workplace: workplace.trim(),
    })
  }

  return (
    <section className="profile-edit-form">
      <div className="profile-edit-form__header">
        <p className="profile-edit-form__eyebrow">Редактирование</p>
        <h2 className="profile-edit-form__title">Редактировать профиль</h2>
      </div>

      <ErrorMessage messages={errors} />

      <form className="profile-edit-form__body" onSubmit={handleSubmit}>
        <div className="profile-edit-form__grid">
          <InputField
            label="Имя"
            name="firstName"
            value={firstName}
            placeholder="Введите имя"
            onChange={(value) => {
              setErrors([])
              setFirstName(value)
            }}
          />

          <InputField
            label="Фамилия"
            name="lastName"
            value={lastName}
            placeholder="Введите фамилию"
            onChange={(value) => {
              setErrors([])
              setLastName(value)
            }}
          />
        </div>

        <InputField
          label="Никнейм"
          name="nickname"
          value={nickname}
          placeholder="Введите никнейм"
          onChange={(value) => {
            setErrors([])
            setNickname(value)
          }}
        />

        <RoleSelector
          value={role}
          onChange={(value) => {
            setErrors([])
            setRole(value)
          }}
        />

        <div className="profile-edit-form__field">
          <label className="profile-edit-form__label" htmlFor="workplace">
            Место работы
          </label>
          <input
            id="workplace"
            className="profile-edit-form__input"
            value={workplace}
            placeholder="Например: OpenAI, Freelance, Student"
            onChange={(e) => {
              setErrors([])
              setWorkplace(e.target.value)
            }}
          />
        </div>

        <div className="profile-edit-form__field">
          <label className="profile-edit-form__label" htmlFor="description">
            Описание
          </label>
          <textarea
            id="description"
            className="profile-edit-form__textarea"
            value={description}
            placeholder="Кратко расскажите о себе"
            rows={5}
            onChange={(e) => {
              setErrors([])
              setDescription(e.target.value)
            }}
          />
        </div>

        <div className="profile-edit-form__actions">
          <button
            type="button"
            className="profile-edit-form__secondary"
            onClick={onCancel}
          >
            Отмена
          </button>

          <button type="submit" className="profile-edit-form__primary">
            Сохранить профиль
          </button>
        </div>
      </form>
    </section>
  )
}