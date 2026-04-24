import type { AuthUser } from '../store/authSlice'
import type { UserRole } from '../types/auth'

const API_BASE_URL = 'http://localhost:3000'

type RegisterPayload = {
  firstName: string
  lastName: string
  nickname: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

type LoginPayload = {
  nickname: string
  password: string
}

type AuthResponse = {
  message: string
  user: AuthUser
}

type MeResponse = {
  isAuthenticated: boolean
  user: AuthUser | null
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({
    message: 'Unexpected server response',
  }))

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data as T
}

export async function registerUser(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<AuthResponse>(response)
}

export async function loginUser(payload: LoginPayload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<AuthResponse>(response)
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  return parseResponse<{ message: string }>(response)
}

export async function fetchMe() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  })

  return parseResponse<MeResponse>(response)
}