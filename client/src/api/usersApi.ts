import type { UserRole } from '../types/auth'
import type { UserProfile } from '../types/profile'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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
  let data: any

  try {
    data = await response.json()
  } catch {
    throw new Error('Unexpected server response')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data as T
}

export async function fetchUserProfile(userId: string) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    credentials: 'include',
  })

  return parseResponse<UserProfile>(response)
}

export async function updateUserProfile(
  userId: string,
  payload: UpdateProfilePayload,
) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<UserProfile>(response)
}

export async function addPortfolioProject(
  userId: string,
  payload: PortfolioPayload,
) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/portfolio`, {
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
  userId: string,
  projectId: string,
  payload: PortfolioPayload,
) {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/portfolio/${projectId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  )

  return parseResponse<UserProfile>(response)
}

export async function deletePortfolioProject(
  userId: string,
  projectId: string,
) {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/portfolio/${projectId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  return parseResponse<UserProfile>(response)
}

function getCurrentUserId() {
  const rawUser = localStorage.getItem('authUser')

  if (!rawUser) {
    throw new Error('User is not authenticated')
  }

  const user = JSON.parse(rawUser) as { id?: string }

  if (!user.id) {
    throw new Error('User id is missing')
  }

  return user.id
}

export async function fetchMyProfile() {
  return fetchUserProfile(getCurrentUserId())
}

export async function updateMyProfile(payload: UpdateProfilePayload) {
  return updateUserProfile(getCurrentUserId(), payload)
}