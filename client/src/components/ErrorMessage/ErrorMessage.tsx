type ErrorMessageProps = {
  messages: string[]
}

export function ErrorMessage({ messages }: ErrorMessageProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <div className="error-box">
      {messages.map((message, index) => (
        <p key={index} className="error-text">
          {message}
        </p>
      ))}
    </div>
  )
}