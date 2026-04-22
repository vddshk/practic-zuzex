import { useEffect } from 'react'
import { AppRouter } from './router/AppRouter'
import { restoreSession } from './store/authSlice'
import { useAppDispatch } from './store/hooks'
import { getAuthUser } from './utils/authStorage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedUser = getAuthUser()
    dispatch(restoreSession(savedUser))
  }, [dispatch])

  return <AppRouter />
}

export default App