import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserRole } from '../types/auth'

export type AuthUser = {
  id: string
  firstName?: string
  lastName?: string
  nickname: string
  email?: string
  role: UserRole
}

type AuthState = {
  isAuthenticated: boolean
  user: AuthUser | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout(state) {
      state.isAuthenticated = false
      state.user = null
    },
    restoreSession(state, action: PayloadAction<AuthUser | null>) {
      state.isAuthenticated = Boolean(action.payload)
      state.user = action.payload
    },
  },
})

export const { loginSuccess, logout, restoreSession } = authSlice.actions
export const authReducer = authSlice.reducer