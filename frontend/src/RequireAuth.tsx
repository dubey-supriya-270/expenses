import {Outlet, Navigate, useLocation} from 'react-router-dom'
import {useAppSelector} from './app/hooks'

export default function RequireAuth() {
  const isAuthed = useAppSelector((s) => s.auth.isAuthenticated)
  const loc = useLocation()
  return isAuthed ? <Outlet /> : <Navigate to="/login" state={{from: loc}} replace />
}
