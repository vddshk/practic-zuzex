import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfile } from '../types/profile'

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
    setProfile(state, action: PayloadAction<UserProfile | null>) {
      state.profile = action.payload
    },

    clearProfile(state) {
      state.profile = null
    },
  },
})

export const { setProfile, clearProfile } = profileSlice.actions
export const profileReducer = profileSlice.reducer