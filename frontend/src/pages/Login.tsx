import LoginForm from '../features/auth/LoginForm'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

export default function Login() {
  const { isAuthenticated } = useAppSelector((s) => s.auth)
  const loc = useLocation()

  if (isAuthenticated) {
    return <Navigate to={loc.state?.from?.pathname ?? '/expenses'} replace />
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-sm space-y-4">
        <LoginForm />
        <p className="text-sm text-center">
          <span className="text-muted-foreground">No account?</span>{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
