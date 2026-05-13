import './ConfirmationModal.scss'

type ConfirmationModalProps = {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="confirmation-modal__overlay" onClick={onCancel}>
      <div
        className="confirmation-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="confirmation-modal__title">{title}</h3>
        <p className="confirmation-modal__message">{message}</p>

        <div className="confirmation-modal__actions">
          <button
            type="button"
            className="confirmation-modal__cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="confirmation-modal__confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}