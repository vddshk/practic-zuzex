import { useEffect } from 'react'
import { fetchMe } from './api/authApi'
import { fetchMyProfile } from './api/usersApi'
import { AppRouter } from './router/AppRouter'
import { restoreSession } from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import { clearProfile, setProfile } from './store/profileSlice'
import { clearAuthUser, saveAuthUser } from './utils/authStorage'
import { clearUserProfile, saveUserProfile } from './utils/profileStorage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const authResponse = await fetchMe()

        if (!authResponse.isAuthenticated || !authResponse.user) {
          dispatch(restoreSession(null))
          dispatch(clearProfile())
          clearAuthUser()
          clearUserProfile()
          return
        }

        dispatch(restoreSession(authResponse.user))
        saveAuthUser(authResponse.user)

        try {
          const profile = await fetchMyProfile()
          dispatch(setProfile(profile))
          saveUserProfile(profile)
        } catch {
          dispatch(clearProfile())
          clearUserProfile()
        }
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