import { useState, type FormEvent } from 'react'
import { useLoginMutation } from '../../api/expenseApi'
import { useAppDispatch } from '../../app/hooks'
import { setAuthData } from './authSlice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginForm() {
  const [state, setState] = useState({ userName: '', password: '' })
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      const { role } = await login(state).unwrap()
      dispatch(setAuthData({ isAuthenticated: true, role }))
      toast.success('Login successful')
    } catch {
      toast.error('Invalid username or password')
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full bg-white p-6 rounded-2xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-semibold text-center">Login</h2>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter your username"
          value={state.userName}
          onChange={(e) => setState({ ...state, userName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={state.password}
          onChange={(e) => setState({ ...state, password: e.target.value })}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        {isLoading ? 'Logging in…' : 'Log In'}
      </Button>
    </form>
  )
}
