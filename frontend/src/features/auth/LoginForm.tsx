import {useState, type FormEvent} from 'react'
import {useLoginMutation} from '../../api/expenseApi'
import {useAppDispatch} from '../../app/hooks'
import {setAuthData} from './authSlice'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'

export default function LoginForm() {
  const [state, setState] = useState({userName: '', password: ''})
  const [login, {isLoading}] = useLoginMutation()
  const dispatch = useAppDispatch()

  async function submit(e: FormEvent) {
    e.preventDefault()
    try {
      const {role} = await login(state).unwrap()
      dispatch(setAuthData({isAuthenticated: true, role}))
    } catch {
      alert('Bad credentials')
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={state.userName}
          onChange={(e) => setState({...state, userName: e.target.value})}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={state.password}
          onChange={(e) => setState({...state, password: e.target.value})}
          required
        />
      </div>

      <Button disabled={isLoading}>
        {isLoading ? '…' : 'Log in'}
      </Button>
    </form>
  )
}
