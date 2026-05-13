import type { UserProfile } from '../../types/profile'

type ProfileHeaderProps = {
  profile: UserProfile
  isOwner: boolean
  onEditProfile: () => void
  onAddProject: () => void
}

export function ProfileHeader({
  profile,
  isOwner,
  onEditProfile,
  onAddProject,
}: ProfileHeaderProps) {
  const displayNickname = profile.nickname.trim() || 'user'
  const displayInitial = displayNickname.charAt(0).toUpperCase()

  return (
    <div className="profile-page__header">
      <div className="profile-page__avatar">{displayInitial}</div>

      <div className="profile-page__info">
        <p className="profile-page__eyebrow">
          {isOwner ? 'Ваш профиль' : 'Профиль пользователя'}
        </p>
        <h1 className="profile-page__title">{displayNickname}</h1>
        <p className="profile-page__role">{profile.role || 'Роль не указана'}</p>
        <p className="profile-page__meta">
          {profile.firstName} {profile.lastName}
        </p>
      </div>

      {isOwner && (
        <div className="profile-page__actions">
          <button
            type="button"
            className="profile-page__primary-button"
            onClick={onEditProfile}
          >
            Редактировать профиль
          </button>

          <button
            type="button"
            className="profile-page__secondary-button"
            onClick={onAddProject}
          >
            Добавить проект
          </button>
        </div>
      )}
    </div>
  )
}