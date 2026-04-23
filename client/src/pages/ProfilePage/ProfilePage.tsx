import { useState } from 'react'
import { ProfileEditForm } from '../../components/ProfileEditForm/ProfileEditForm'
import { updateCurrentUserProfile } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { updateProfile } from '../../store/profileSlice'
import { saveAuthUser } from '../../utils/authStorage'
import { saveUserProfile } from '../../utils/profileStorage'
import './ProfilePage.scss'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.profile.profile)
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (!profile) {
    return (
      <section className="profile-page">
        <div className="profile-page__content">
          <h1 className="profile-page__section-title">Профиль не найден</h1>
        </div>
      </section>
    )
  }

  const handleSaveProfile = (values: {
    firstName: string
    lastName: string
    nickname: string
    role: typeof profile.role
    description: string
    workplace: string
  }) => {
    const updatedProfile = {
      ...profile,
      firstName: values.firstName,
      lastName: values.lastName,
      nickname: values.nickname,
      role: values.role,
      description: values.description,
      workplace: values.workplace,
    }

    dispatch(updateProfile(values))

    dispatch(
      updateCurrentUserProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        nickname: values.nickname,
        role: values.role,
      }),
    )

    saveUserProfile(updatedProfile)

    saveAuthUser({
      id: profile.userId,
      firstName: values.firstName,
      lastName: values.lastName,
      nickname: values.nickname,
      email: profile.email ?? '',
      role: values.role,
    })

    setIsEditOpen(false)
  }

  return (
    <section className="profile-page">
      <div className="profile-page__header">
        <div className="profile-page__avatar">
          {profile.nickname.slice(0, 1).toUpperCase()}
        </div>

        <div className="profile-page__info">
          <p className="profile-page__eyebrow">Профиль пользователя</p>
          <h1 className="profile-page__title">{profile.nickname}</h1>
          <p className="profile-page__role">{profile.role}</p>
          <p className="profile-page__meta">
            {profile.firstName} {profile.lastName}
          </p>
        </div>

        <div className="profile-page__actions">
          <button
            type="button"
            className="profile-page__primary-button"
            onClick={() => setIsEditOpen((prev) => !prev)}
          >
            {isEditOpen ? 'Закрыть редактирование' : 'Редактировать профиль'}
          </button>

          <button type="button" className="profile-page__secondary-button">
            Добавить проект
          </button>
        </div>
      </div>

      {isEditOpen && (
        <ProfileEditForm
          profile={profile}
          onSubmit={handleSaveProfile}
          onCancel={() => setIsEditOpen(false)}
        />
      )}

      <div className="profile-page__grid">
        <aside className="profile-page__sidebar">
          <div className="profile-page__panel">
            <h2 className="profile-page__panel-title">Основная информация</h2>
            <p className="profile-page__panel-text">Имя: {profile.firstName}</p>
            <p className="profile-page__panel-text">Фамилия: {profile.lastName}</p>
            <p className="profile-page__panel-text">Никнейм: {profile.nickname}</p>
            <p className="profile-page__panel-text">Роль: {profile.role}</p>
            {profile.email && (
              <p className="profile-page__panel-text">Email: {profile.email}</p>
            )}
            {profile.workplace && (
              <p className="profile-page__panel-text">
                Место работы: {profile.workplace}
              </p>
            )}
          </div>

          <div className="profile-page__panel">
            <h2 className="profile-page__panel-title">О профиле</h2>
            <p className="profile-page__panel-text">
              {profile.description || 'Описание пока не заполнено.'}
            </p>
          </div>
        </aside>

        <div className="profile-page__content">
          <h2 className="profile-page__section-title">Портфолио</h2>
          <p className="profile-page__panel-text">
            Проектов в портфолио: {profile.portfolio.length}
          </p>
          <p className="profile-page__panel-text" style={{ marginTop: '12px' }}>
            Следующим шагом добавим создание, редактирование и удаление проектов.
          </p>
        </div>
      </div>
    </section>
  )
}