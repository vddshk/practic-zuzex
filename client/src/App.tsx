import { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { restoreSession } from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import { restoreStoredProfile, syncProfileFromAuth } from './store/profileSlice'
import { getAuthUser } from './utils/authStorage'
import { getUserProfile } from './utils/profileStorage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedUser = getAuthUser()
    const savedProfile = getUserProfile()

    dispatch(restoreSession(savedUser))

    if (savedProfile) {
      dispatch(restoreStoredProfile(savedProfile))
    } else {
      dispatch(syncProfileFromAuth(savedUser))
    }
  }, [dispatch])

  return <AppRouter />
}

export default App