import type { UserRole } from './auth'

export type PortfolioProject = {
  id: string
  title: string
  description?: string
  links: string[]
  previewImage?: string
}

export type UserProfile = {
  userId: string
  firstName: string
  lastName: string
  nickname: string
  role: UserRole
  email?: string
  description: string
  workplace: string
  portfolio: PortfolioProject[]
}