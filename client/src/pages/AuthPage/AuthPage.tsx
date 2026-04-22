import { useState } from 'react'
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage'
import { InputField } from '../../components/InputField/InputField'
import { RoleSelector } from '../../components/RoleSelector/RoleSelector'
import type { UserRole } from '../../types/auth'
import './AuthPage.scss'

type AuthMode = 'login' | 'register'

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [errors, setErrors] = useState<string[]>([])

  const isRegister = mode === 'register'

  const resetErrors = () => {
    setErrors([])
  }

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setErrors([])
  }

  const validateForm = () => {
    const nextErrors: string[] = []

    if (!nickname.trim()) {
      nextErrors.push('Введите никнейм')
    }

    if (!password.trim()) {
      nextErrors.push('Введите пароль')
    }

    if (isRegister) {
      if (!firstName.trim()) {
        nextErrors.push('Введите имя')
      }

      if (!lastName.trim()) {
        nextErrors.push('Введите фамилию')
      }

      if (!email.trim()) {
        nextErrors.push('Введите email')
      }

      if (password.length < 8) {
        nextErrors.push('Пароль должен содержать минимум 8 символов')
      }

      if (!/\d/.test(password) || !/[A-Za-zА-Яа-я]/.test(password)) {
        nextErrors.push('Пароль должен содержать буквы и цифры')
      }

      if (password !== confirmPassword) {
        nextErrors.push('Пароль и подтверждение пароля не совпадают')
      }

      if (!role) {
        nextErrors.push('Выберите роль')
      }
    }

    setErrors(nextErrors)

    return nextErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    if (mode === 'login') {
      alert('Форма входа валидна. API подключим позже.')
      return
    }

    alert('Форма регистрации валидна. API подключим позже.')
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Practice Social App</h1>
          <p className="auth-subtitle">
            Площадка для разработчиков, менеджеров, дизайнеров и HR
          </p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Вход
          </button>

          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Регистрация
          </button>
        </div>

        <ErrorMessage messages={errors} />

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <InputField
                label="Имя"
                name="firstName"
                value={firstName}
                placeholder="Введите имя"
                onChange={(value) => {
                  resetErrors()
                  setFirstName(value)
                }}
              />

              <InputField
                label="Фамилия"
                name="lastName"
                value={lastName}
                placeholder="Введите фамилию"
                onChange={(value) => {
                  resetErrors()
                  setLastName(value)
                }}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={email}
                placeholder="Введите email"
                onChange={(value) => {
                  resetErrors()
                  setEmail(value)
                }}
              />
            </>
          )}

          <InputField
            label="Никнейм"
            name="nickname"
            value={nickname}
            placeholder="Введите никнейм"
            onChange={(value) => {
              resetErrors()
              setNickname(value)
            }}
          />

          <InputField
            label="Пароль"
            name="password"
            type="password"
            value={password}
            placeholder="Введите пароль"
            onChange={(value) => {
              resetErrors()
              setPassword(value)
            }}
          />

          {isRegister && (
            <>
              <InputField
                label="Подтверждение пароля"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                placeholder="Повторите пароль"
                onChange={(value) => {
                  resetErrors()
                  setConfirmPassword(value)
                }}
              />

              <RoleSelector
                value={role}
                onChange={(value) => {
                  resetErrors()
                  setRole(value)
                }}
              />
            </>
          )}

          <button type="submit" className="auth-submit-button">
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
      </div>
    </section>
  )
}