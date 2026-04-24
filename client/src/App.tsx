import { useEffect } from 'react'
import { fetchMe } from './api/authApi'
import { restoreSession } from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import {
  clearProfile,
  restoreStoredProfile,
  syncProfileFromAuth,
} from './store/profileSlice'
import { getAuthUser, saveAuthUser, clearAuthUser } from './utils/authStorage'
import { getUserProfile, clearUserProfile } from './utils/profileStorage'
import { AppRouter } from './router/AppRouter'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const response = await fetchMe()

        if (!response.isAuthenticated || !response.user) {
          dispatch(restoreSession(null))
          dispatch(clearProfile())
          clearAuthUser()
          clearUserProfile()
          return
        }

        const storedAuthUser = getAuthUser()
        const storedProfile = getUserProfile()

        const resolvedUser =
          storedAuthUser && storedAuthUser.id === response.user.id
            ? storedAuthUser
            : response.user

        dispatch(restoreSession(resolvedUser))

        if (storedProfile && storedProfile.userId === resolvedUser.id) {
          dispatch(restoreStoredProfile(storedProfile))
        } else {
          dispatch(syncProfileFromAuth(resolvedUser))
        }

        saveAuthUser(resolvedUser)
      } catch {
        dispatch(restoreSession(null))
        dispatch(clearProfile())
        clearAuthUser()
        clearUserProfile()
      }
    }

    void bootstrapAuth()
  }, [dispatch])

  return <AppRouter />
}

export default App