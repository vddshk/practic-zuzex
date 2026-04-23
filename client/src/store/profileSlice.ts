import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from './authSlice'
import type { UserProfile } from '../types/profile'
import type { UserRole } from '../types/auth'

type ProfileState = {
  profile: UserProfile | null
}

const initialState: ProfileState = {
  profile: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    restoreStoredProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload
    },

    syncProfileFromAuth(state, action: PayloadAction<AuthUser | null>) {
      const user = action.payload

      if (!user) {
        state.profile = null
        return
      }

      if (state.profile && state.profile.userId === user.id) {
        state.profile.firstName = user.firstName ?? state.profile.firstName
        state.profile.lastName = user.lastName ?? state.profile.lastName
        state.profile.nickname = user.nickname
        state.profile.role = user.role
        state.profile.email = user.email ?? state.profile.email
        return
      }

      state.profile = {
        userId: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        nickname: user.nickname,
        role: user.role,
        email: user.email ?? '',
        description: '',
        workplace: '',
        portfolio: [],
      }
    },

    updateProfile(
      state,
      action: PayloadAction<{
        firstName: string
        lastName: string
        nickname: string
        role: UserRole
        description: string
        workplace: string
      }>,
    ) {
      if (!state.profile) {
        return
      }

      state.profile.firstName = action.payload.firstName
      state.profile.lastName = action.payload.lastName
      state.profile.nickname = action.payload.nickname
      state.profile.role = action.payload.role
      state.profile.description = action.payload.description
      state.profile.workplace = action.payload.workplace
    },

    clearProfile(state) {
      state.profile = null
    },
  },
})

export const {
  restoreStoredProfile,
  syncProfileFromAuth,
  updateProfile,
  clearProfile,
} = profileSlice.actions

export const profileReducer = profileSlice.reducer