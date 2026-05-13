export type PostType = 'Контент' | 'Событие' | 'Вакансия'

export type PostDirection =
  | 'Frontend'
  | 'Backend'
  | 'QA'
  | 'Design'
  | 'Management'
  | 'HR'

export type Post = {
  id: string
  title: string
  content: string
  authorId: string
  author: string
  type: PostType
  direction: PostDirection
  likes: number
  isLikedByUser: boolean
  previewImage?: string
}