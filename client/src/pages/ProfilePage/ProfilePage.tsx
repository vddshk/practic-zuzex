import { useState } from 'react'
import { ProfileEditForm } from '../../components/ProfileEditForm/ProfileEditForm'
import { ProjectForm } from '../../components/ProjectForm/ProjectForm'
import { updateCurrentUserProfile } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  addPortfolioProject,
  deletePortfolioProject,
  updatePortfolioProject,
  updateProfile,
} from '../../store/profileSlice'
import type { PortfolioProject } from '../../types/profile'
import { saveAuthUser } from '../../utils/authStorage'
import { saveUserProfile } from '../../utils/profileStorage'
import './ProfilePage.scss'

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const profile = useAppSelector((state) => state.profile.profile)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)

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

  const handleOpenCreateProject = () => {
    setEditingProject(null)
    setIsProjectFormOpen(true)
  }

  const handleOpenEditProject = (project: PortfolioProject) => {
    setEditingProject(project)
    setIsProjectFormOpen(true)
  }

  const handleCloseProjectForm = () => {
    setEditingProject(null)
    setIsProjectFormOpen(false)
  }

  const handleSubmitProject = (values: {
    title: string
    description: string
    links: string[]
  }) => {
    if (editingProject) {
      const updatedProject: PortfolioProject = {
        ...editingProject,
        title: values.title,
        description: values.description,
        links: values.links,
      }

      dispatch(updatePortfolioProject(updatedProject))

      saveUserProfile({
        ...profile,
        portfolio: profile.portfolio.map((project) =>
          project.id === updatedProject.id ? updatedProject : project,
        ),
      })

      handleCloseProjectForm()
      return
    }

    const newProject: PortfolioProject = {
      id: crypto.randomUUID(),
      title: values.title,
      description: values.description,
      links: values.links,
    }

    dispatch(addPortfolioProject(newProject))

    saveUserProfile({
      ...profile,
      portfolio: [newProject, ...profile.portfolio],
    })

    handleCloseProjectForm()
  }

  const handleDeleteProject = (projectId: string) => {
    const shouldDelete = window.confirm('Удалить этот проект?')

    if (!shouldDelete) {
      return
    }

    dispatch(deletePortfolioProject(projectId))

    saveUserProfile({
      ...profile,
      portfolio: profile.portfolio.filter((project) => project.id !== projectId),
    })
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

          <button
            type="button"
            className="profile-page__secondary-button"
            onClick={handleOpenCreateProject}
          >
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

      {isProjectFormOpen && (
        <ProjectForm
          initialProject={editingProject}
          onSubmit={handleSubmitProject}
          onCancel={handleCloseProjectForm}
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

          {profile.portfolio.length > 0 ? (
            <div className="profile-page__projects">
              {profile.portfolio.map((project) => (
                <article key={project.id} className="profile-page__project-card">
                  <h3 className="profile-page__project-title">{project.title}</h3>

                  <p className="profile-page__project-description">
                    {project.description || 'Описание проекта не заполнено.'}
                  </p>

                  {project.links.length > 0 && (
                    <div className="profile-page__project-links">
                      {project.links.map((link) => (
                        <a
                          key={link}
                          className="profile-page__project-link"
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="profile-page__project-actions">
                    <button
                      type="button"
                      className="profile-page__project-edit"
                      onClick={() => handleOpenEditProject(project)}
                    >
                      Редактировать
                    </button>

                    <button
                      type="button"
                      className="profile-page__project-delete"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-page__empty">
              <h3 className="profile-page__empty-title">Портфолио пока пустое</h3>
              <p className="profile-page__empty-text">
                Добавь первый проект, чтобы заполнить профиль.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}