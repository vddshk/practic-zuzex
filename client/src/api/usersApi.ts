import type { UserProfile } from '../types/profile'
import type { UserRole } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type UpdateProfilePayload = {
  firstName: string
  lastName: string
  nickname: string
  role: UserRole
  description: string
  workplace: string
}

type PortfolioPayload = {
  title: string
  description?: string
  links?: string[]
  previewImage?: string
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

export async function fetchMyProfile() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
  })

  return parseResponse<UserProfile>(response)
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<UserProfile>(response)
}

export async function addPortfolioProject(payload: PortfolioPayload) {
  const response = await fetch(`${API_BASE_URL}/users/me/portfolio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<UserProfile>(response)
}

export async function updatePortfolioProject(
  projectId: string,
  payload: PortfolioPayload,
) {
  const response = await fetch(`${API_BASE_URL}/users/me/portfolio/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<UserProfile>(response)
}

export async function deletePortfolioProject(projectId: string) {
  const response = await fetch(`${API_BASE_URL}/users/me/portfolio/${projectId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  return parseResponse<UserProfile>(response)
}