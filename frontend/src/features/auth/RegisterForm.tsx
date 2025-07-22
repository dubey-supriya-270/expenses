import { useState, type FormEvent } from 'react'
import { useRegisterMutation } from '../../api/expenseApi'
import { useAppDispatch } from '../../app/hooks'
import { setAuthData } from './authSlice'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function RegisterForm() {
  const [state, setState] = useState({
    userName: '',
    password: '',
    confirm: '',
  })

  const [register, { isLoading }] = useRegisterMutation()
  const dispatch = useAppDispatch()

  async function submit(e: FormEvent) {
    e.preventDefault()

    if (state.password !== state.confirm) {
      toast.error('Passwords do not match!')
      return
    }

    try {
      const { role } = await register({
        userName: state.userName,
        password: state.password,
      }).unwrap()

      dispatch(setAuthData({ isAuthenticated: true, role }))
      toast.success('Registration successful')
    } catch {
      toast.error('Registration failed')
    }
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-5"
    >
      <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

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

      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input
          id="confirm"
          type="password"
          placeholder="Re-enter your password"
          value={state.confirm}
          onChange={(e) => setState({ ...state, confirm: e.target.value })}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
      >
        {isLoading ? 'Registering…' : 'Register'}
      </Button>
    </form>
  )
}
