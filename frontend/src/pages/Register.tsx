import RegisterForm from '../features/auth/RegisterForm'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export default function Register() {
  const isAuthed = useAppSelector((s) => s.auth.isAuthenticated)

  if (isAuthed) return <Navigate to="/expenses" replace />

  return (
    <div className="flex justify-center pt-24 px-4">
      <div className="w-full max-w-md space-y-3">
        <RegisterForm />
      </div>
    </div>
  )
}
