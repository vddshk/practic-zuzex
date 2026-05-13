import type { UserProfile } from '../types/profile'

const PROFILE_KEY = 'user_profile'

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function getUserProfile(): UserProfile | null {
  const rawProfile = localStorage.getItem(PROFILE_KEY)

  if (!rawProfile) {
    return null
  }

  try {
    return JSON.parse(rawProfile) as UserProfile
  } catch {
    localStorage.removeItem(PROFILE_KEY)
    return null
  }
}

export function clearUserProfile() {
  localStorage.removeItem(PROFILE_KEY)
}