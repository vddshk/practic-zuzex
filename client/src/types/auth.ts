export const roles = [
  'Frontend Developer',
  'Backend Developer',
  'QA Engineer',
  'Designer',
  'Manager',
  'HR',
] as const

export type UserRole = (typeof roles)[number]