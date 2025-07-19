// src/pages/Register.tsx
import RegisterForm from '../features/auth/RegisterForm'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Navigate} from 'react-router-dom'
import {useAppSelector} from '../app/hooks'

export default function Register() {
  // ✔ when the register mutation succeeds, auth slice flips to true
  const isAuthed = useAppSelector((s) => s.auth.isAuthenticated)

  // instant redirect to the expenses route
  if (isAuthed) return <Navigate to="/expenses" replace />

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
