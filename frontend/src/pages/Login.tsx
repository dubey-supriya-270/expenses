import LoginForm from '../features/auth/LoginForm'
import {Link, useLocation, Navigate} from 'react-router-dom'
import {useAppSelector} from '../app/hooks'

export default function Login() {
  const {isAuthenticated} = useAppSelector((s) => s.auth)
  const loc = useLocation()
  if (isAuthenticated) return <Navigate to={loc.state?.from?.pathname ?? '/expenses'} replace />

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Log in</h1>
      <LoginForm />
      <p>
        No account?{' '}
        <Link to="/register" className="underline text-blue-600">
          Register
        </Link>
      </p>
    </div>
  )
}
