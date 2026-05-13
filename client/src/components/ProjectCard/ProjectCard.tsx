import type { PortfolioProject } from '../../types/profile'

type ProjectCardProps = {
  project: PortfolioProject
  isOwner: boolean
  onOpen: (project: PortfolioProject) => void
  onEdit: (project: PortfolioProject) => void
  onDelete: (projectId: string) => void
}

export function ProjectCard({
  project,
  isOwner,
  onOpen,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <article
      className="profile-page__project-card"
      onClick={() => onOpen(project)}
    >
      {project.previewImage && (
        <img
          className="profile-page__project-preview"
          src={project.previewImage}
          alt={project.title}
        />
      )}

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
              onClick={(event) => event.stopPropagation()}
            >
              {link}
            </a>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="profile-page__project-actions">
          <button
            type="button"
            className="profile-page__project-edit"
            onClick={(event) => {
              event.stopPropagation()
              onEdit(project)
            }}
          >
            Редактировать
          </button>

          <button
            type="button"
            className="profile-page__project-delete"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(project.id)
            }}
          >
            Удалить
          </button>
        </div>
      )}
    </article>
  )
}