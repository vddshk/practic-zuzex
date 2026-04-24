export const USER_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'Designer',
  'Manager',
  'HR',
] as const

export type UserRole = (typeof USER_ROLES)[number]