import type { PortfolioProject } from '../../types/profile'
import { ProjectCard } from '../ProjectCard/ProjectCard'

type PortfolioBlockProps = {
  projects: PortfolioProject[]
  isOwner: boolean
  onOpenProject: (project: PortfolioProject) => void
  onEditProject: (project: PortfolioProject) => void
  onDeleteProject: (projectId: string) => void
}

export function PortfolioBlock({
  projects,
  isOwner,
  onOpenProject,
  onEditProject,
  onDeleteProject,
}: PortfolioBlockProps) {
  return (
    <div className="profile-page__content">
      <h2 className="profile-page__section-title">Портфолио</h2>

      {projects.length > 0 ? (
        <div className="profile-page__projects">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isOwner={isOwner}
              onOpen={onOpenProject}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="profile-page__empty">
          <h3 className="profile-page__empty-title">Портфолио пока пустое</h3>
          <p className="profile-page__empty-text">
            {isOwner
              ? 'Добавь первый проект, чтобы заполнить профиль.'
              : 'У пользователя пока нет добавленных проектов.'}
          </p>
        </div>
      )}
    </div>
  )
}