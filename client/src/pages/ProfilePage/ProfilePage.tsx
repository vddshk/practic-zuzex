import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  addPortfolioProject as addPortfolioProjectRequest,
  deletePortfolioProject as deletePortfolioProjectRequest,
  fetchUserProfile,
  updatePortfolioProject as updatePortfolioProjectRequest,
  updateUserProfile as updateUserProfileRequest,
} from '../../api/usersApi'
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal'
import { PortfolioBlock } from '../../components/PortfolioBlock/PortfolioBlock'
import { ProfileEditForm } from '../../components/ProfileEditForm/ProfileEditForm'
import { ProfileHeader } from '../../components/ProfileHeader/ProfileHeader'
import { ProjectDetailsModal } from '../../components/ProjectDetailsModal/ProjectDetailsModal'
import { ProjectForm } from '../../components/ProjectForm/ProjectForm'
import { updateCurrentUserProfile } from '../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setProfile } from '../../store/profileSlice'
import type { PortfolioProject, UserProfile } from '../../types/profile'
import { saveAuthUser } from '../../utils/authStorage'
import { saveUserProfile } from '../../utils/profileStorage'
import './ProfilePage.scss'

function normalizeProfile(data: any): UserProfile {
  const userId = String(data?.userId ?? data?.id ?? '')
  const nickname = data?.nickname ?? ''

  if (!userId || !nickname) {
    throw new Error('Профиль не найден')
  }

  return {
    userId,
    firstName: data?.firstName ?? '',
    lastName: data?.lastName ?? '',
    nickname,
    role: data?.role ?? '',
    email: data?.email ?? '',
    description: data?.description ?? '',
    workplace: data?.workplace ?? '',
    portfolio: Array.isArray(data?.portfolio)
      ? data.portfolio.map((project: any) => ({
          id: String(project?.id ?? project?._id ?? ''),
          title: project?.title ?? '',
          description: project?.description ?? '',
          links: Array.isArray(project?.links) ? project.links : [],
          previewImage: project?.previewImage ?? '',
        }))
      : [],
  }
}

export function ProfilePage() {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const authUser = useAppSelector((state) => state.auth.user)

  const isOwner = Boolean(authUser && id === authUser.id)

  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setViewedProfile(null)
        setError('Некорректный id профиля')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const rawData = await fetchUserProfile(id)
        const data = normalizeProfile(rawData)

        setViewedProfile(data)

        if (isOwner) {
          dispatch(setProfile(data))
          saveUserProfile(data)
        }
      } catch (err) {
        setViewedProfile(null)
        setError(err instanceof Error ? err.message : 'Не удалось загрузить профиль')
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [dispatch, id, isOwner])

  useEffect(() => {
    if (!id || isEditOpen || isProjectFormOpen || selectedProject) {
      return
    }

    const intervalId = window.setInterval(async () => {
      try {
        const rawData = await fetchUserProfile(id)
        const data = normalizeProfile(rawData)

        setViewedProfile(data)

        if (isOwner) {
          dispatch(setProfile(data))
          saveUserProfile(data)
        }
      } catch {
        // ничего не делаем, чтобы не ломать экран временными ошибками
      }
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [dispatch, id, isEditOpen, isOwner, isProjectFormOpen, selectedProject])

  const handleSaveProfile = async (values: {
    firstName: string
    lastName: string
    nickname: string
    role: string
    description: string
    workplace: string
  }) => {
    if (!viewedProfile || !isOwner || !authUser) {
      return
    }

    try {
      setError('')

      const rawUpdatedProfile = await updateUserProfileRequest(authUser.id, {
        firstName: values.firstName,
        lastName: values.lastName,
        nickname: values.nickname,
        role: values.role as typeof viewedProfile.role,
        description: values.description,
        workplace: values.workplace,
      })

      const updatedProfile = normalizeProfile(rawUpdatedProfile)

      setViewedProfile(updatedProfile)
      dispatch(setProfile(updatedProfile))
      saveUserProfile(updatedProfile)

      dispatch(
        updateCurrentUserProfile({
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          nickname: updatedProfile.nickname,
          role: updatedProfile.role,
        }),
      )

      saveAuthUser({
        id: updatedProfile.userId,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
        nickname: updatedProfile.nickname,
        email: updatedProfile.email ?? '',
        role: updatedProfile.role,
      })

      setIsEditOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить профиль')
    }
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

  const handleSubmitProject = async (values: {
    title: string
    description: string
    links: string[]
    previewImage: string
  }) => {
    if (!isOwner || !authUser) {
      return
    }

    try {
      setError('')

      const rawUpdatedProfile = editingProject
        ? await updatePortfolioProjectRequest(authUser.id, editingProject.id, values)
        : await addPortfolioProjectRequest(authUser.id, values)

      const updatedProfile = normalizeProfile(rawUpdatedProfile)

      setViewedProfile(updatedProfile)
      dispatch(setProfile(updatedProfile))
      saveUserProfile(updatedProfile)
      handleCloseProjectForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить проект')
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (!isOwner) {
      return
    }

    setDeletingProjectId(projectId)
  }

  const handleConfirmDeleteProject = async () => {
    if (!deletingProjectId || !isOwner || !authUser) {
      return
    }

    try {
      setError('')

      const rawUpdatedProfile = await deletePortfolioProjectRequest(
        authUser.id,
        deletingProjectId,
      )
      const updatedProfile = normalizeProfile(rawUpdatedProfile)

      setViewedProfile(updatedProfile)
      dispatch(setProfile(updatedProfile))
      saveUserProfile(updatedProfile)
      setDeletingProjectId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить проект')
    }
  }

  if (isLoading) {
    return (
      <section className="profile-page">
        <div className="profile-page__content">
          <h1 className="profile-page__section-title">Загрузка профиля...</h1>
        </div>
      </section>
    )
  }

  if (!viewedProfile) {
    return (
      <section className="profile-page">
        <div className="profile-page__content">
          <h1 className="profile-page__section-title">Профиль не найден</h1>
          {error && <p className="profile-page__panel-text">{error}</p>}
        </div>
      </section>
    )
  }

  return (
    <section className="profile-page">
      <ProfileHeader
        profile={viewedProfile}
        isOwner={isOwner}
        onEditProfile={() => setIsEditOpen(true)}
        onAddProject={handleOpenCreateProject}
      />

      {error && (
        <div className="profile-page__empty">
          <h3 className="profile-page__empty-title">Ошибка</h3>
          <p className="profile-page__empty-text">{error}</p>
        </div>
      )}

      {isOwner && isEditOpen && (
        <div
          className="profile-page__modal-overlay"
          onClick={() => setIsEditOpen(false)}
        >
          <div
            className="profile-page__modal-window"
            onClick={(event) => event.stopPropagation()}
          >
            <ProfileEditForm
              profile={viewedProfile}
              onSubmit={handleSaveProfile}
              onCancel={() => setIsEditOpen(false)}
            />
          </div>
        </div>
      )}

      {isOwner && isProjectFormOpen && (
        <div
          className="profile-page__modal-overlay"
          onClick={handleCloseProjectForm}
        >
          <div
            className="profile-page__modal-window"
            onClick={(event) => event.stopPropagation()}
          >
            <ProjectForm
              initialProject={editingProject}
              onSubmit={handleSubmitProject}
              onCancel={handleCloseProjectForm}
            />
          </div>
        </div>
      )}

      {deletingProjectId && (
        <ConfirmationModal
          title="Удалить проект"
          message="Проект будет удалён без возможности восстановления."
          confirmText="Удалить"
          cancelText="Отмена"
          onConfirm={handleConfirmDeleteProject}
          onCancel={() => setDeletingProjectId(null)}
        />
      )}

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          authorId={viewedProfile.userId}
          authorNickname={viewedProfile.nickname}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <div className="profile-page__grid">
        <aside className="profile-page__sidebar">
          <div className="profile-page__panel">
            <h2 className="profile-page__panel-title">Основная информация</h2>
            <p className="profile-page__panel-text">Имя: {viewedProfile.firstName || '—'}</p>
            <p className="profile-page__panel-text">Фамилия: {viewedProfile.lastName || '—'}</p>
            <p className="profile-page__panel-text">Никнейм: {viewedProfile.nickname || '—'}</p>
            <p className="profile-page__panel-text">Роль: {viewedProfile.role || '—'}</p>
            {viewedProfile.email && (
              <p className="profile-page__panel-text">Email: {viewedProfile.email}</p>
            )}
            {viewedProfile.workplace && (
              <p className="profile-page__panel-text">
                Место работы: {viewedProfile.workplace}
              </p>
            )}
          </div>

          <div className="profile-page__panel">
            <h2 className="profile-page__panel-title">О профиле</h2>
            <p className="profile-page__panel-text">
              {viewedProfile.description || 'Описание пока не заполнено.'}
            </p>
          </div>
        </aside>

        <PortfolioBlock
          projects={viewedProfile.portfolio}
          isOwner={isOwner}
          onOpenProject={(project) => setSelectedProject(project)}
          onEditProject={handleOpenEditProject}
          onDeleteProject={handleDeleteProject}
        />
      </div>
    </section>
  )
}