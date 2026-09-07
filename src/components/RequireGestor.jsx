import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireGestor() {
  const { isGestor } = useAuth()

  if (!isGestor) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
