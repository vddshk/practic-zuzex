import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './authSlice'
import { feedReducer } from './feedSlice'
import { profileReducer } from './profileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    feed: feedReducer,
    profile: profileReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch