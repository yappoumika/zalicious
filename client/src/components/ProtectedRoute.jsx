import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAdminAuth()
  const location = useLocation()

  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
