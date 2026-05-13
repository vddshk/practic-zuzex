import type { Post } from '../types/post'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type PostPayload = {
  title: string
  content: string
  type: Post['type']
  direction: Post['direction']
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

export async function fetchPosts(filters?: {
  type?: string
  direction?: string
}) {
  const params = new URLSearchParams()

  if (filters?.type && filters.type !== 'Все') {
    params.set('type', filters.type)
  }

  if (filters?.direction && filters.direction !== 'Все') {
    params.set('direction', filters.direction)
  }

  const query = params.toString()
  const url = `${API_BASE_URL}/posts${query ? `?${query}` : ''}`

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  })

  return parseResponse<Post[]>(response)
}

export async function createPost(payload: PostPayload) {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<Post>(response)
}

export async function updatePost(postId: string, payload: Partial<PostPayload>) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  return parseResponse<Post>(response)
}

export async function deletePost(postId: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  return parseResponse<{ message: string }>(response)
}

export async function likePost(postId: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    credentials: 'include',
  })

  return parseResponse<Post>(response)
}

export async function unlikePost(postId: string) {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
    method: 'DELETE',
    credentials: 'include',
  })

  return parseResponse<Post>(response)
}