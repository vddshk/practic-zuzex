import { Link } from 'react-router-dom'
import type { PortfolioProject } from '../../types/profile'

type ProjectDetailsModalProps = {
  project: PortfolioProject
  authorId: string
  authorNickname: string
  onClose: () => void
}

export function ProjectDetailsModal({
  project,
  authorId,
  authorNickname,
  onClose,
}: ProjectDetailsModalProps) {
  return (
    <div className="profile-page__modal-overlay" onClick={onClose}>
      <div
        className="profile-page__modal-window"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="profile-page__project-modal">
          <div className="profile-page__project-modal-head">
            <h2 className="profile-page__section-title">{project.title}</h2>
            <button
              type="button"
              className="profile-page__secondary-button"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>

          <p className="profile-page__project-modal-meta">
            Автор:{' '}
            <Link
              className="profile-page__project-link"
              to={`/profile/${authorId}`}
            >
              {authorNickname}
            </Link>
          </p>

          {project.previewImage && (
            <img
              className="profile-page__project-modal-image"
              src={project.previewImage}
              alt={project.title}
            />
          )}

          <div className="profile-page__project-modal-section">
            <h3 className="profile-page__panel-title">Описание</h3>
            <p className="profile-page__project-modal-text">
              {project.description || 'Описание проекта не заполнено.'}
            </p>
          </div>

          <div className="profile-page__project-modal-section">
            <h3 className="profile-page__panel-title">Ссылки</h3>

            {project.links.length > 0 ? (
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
            ) : (
              <p className="profile-page__panel-text">Ссылки не добавлены.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}