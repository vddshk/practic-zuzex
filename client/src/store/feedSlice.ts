import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Post, PostDirection, PostType } from '../types/post'

type FeedFilters = {
  type: PostType | 'Все'
  direction: PostDirection | 'Все'
}

type FeedState = {
  posts: Post[]
  filters: FeedFilters
}

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Как я организую frontend-архитектуру в небольших проектах',
    content:
      'Разбираю базовую структуру папок, подход к компонентам, стилизации и работе с состоянием. Это удобная отправная точка для MVP.',
    author: 'alex.dev',
    type: 'Контент',
    direction: 'Frontend',
    likes: 12,
    isLikedByUser: false,
  },
  {
    id: '2',
    title: 'Ищем QA Engineer в pet-проект',
    content:
      'Нужен человек, который поможет выстроить базовые тест-кейсы, smoke-проверки и минимальный процесс контроля качества.',
    author: 'hr.team',
    type: 'Вакансия',
    direction: 'QA',
    likes: 5,
    isLikedByUser: false,
  },
  {
    id: '3',
    title: 'Небольшой meetup по backend-разработке',
    content:
      'Поговорим про API, архитектуру модулей, аутентификацию и типичные ошибки при построении первых серверных приложений.',
    author: 'node.group',
    type: 'Событие',
    direction: 'Backend',
    likes: 8,
    isLikedByUser: true,
  },
]

const initialState: FeedState = {
  posts: initialPosts,
  filters: {
    type: 'Все',
    direction: 'Все',
  },
}

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setTypeFilter(state, action: PayloadAction<PostType | 'Все'>) {
      state.filters.type = action.payload
    },
    setDirectionFilter(state, action: PayloadAction<PostDirection | 'Все'>) {
      state.filters.direction = action.payload
    },
    toggleLike(state, action: PayloadAction<string>) {
      const post = state.posts.find((item) => item.id === action.payload)

      if (!post) {
        return
      }

      if (post.isLikedByUser) {
        post.isLikedByUser = false
        post.likes -= 1
      } else {
        post.isLikedByUser = true
        post.likes += 1
      }
    },
  },
})

export const { setTypeFilter, setDirectionFilter, toggleLike } = feedSlice.actions
export const feedReducer = feedSlice.reducer