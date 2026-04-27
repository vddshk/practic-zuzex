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

const initialState: FeedState = {
  posts: [],
  filters: {
    type: 'Все',
    direction: 'Все',
  },
}

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setPosts(state, action: PayloadAction<Post[]>) {
      state.posts = action.payload
    },

    setTypeFilter(state, action: PayloadAction<PostType | 'Все'>) {
      state.filters.type = action.payload
    },

    setDirectionFilter(state, action: PayloadAction<PostDirection | 'Все'>) {
      state.filters.direction = action.payload
    },

    addPost(state, action: PayloadAction<Post>) {
      state.posts.unshift(action.payload)
    },

    updatePost(state, action: PayloadAction<Post>) {
      const index = state.posts.findIndex((post) => post.id === action.payload.id)

      if (index === -1) {
        return
      }

      state.posts[index] = action.payload
    },

    deletePost(state, action: PayloadAction<string>) {
      state.posts = state.posts.filter((post) => post.id !== action.payload)
    },
  },
})

export const {
  setPosts,
  setTypeFilter,
  setDirectionFilter,
  addPost,
  updatePost,
  deletePost,
} = feedSlice.actions

export const feedReducer = feedSlice.reducer