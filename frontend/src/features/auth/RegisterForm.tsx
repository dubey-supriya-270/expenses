import {useState, type FormEvent} from 'react'
import {useRegisterMutation} from '../../api/expenseApi'
import {useAppDispatch} from '../../app/hooks'
import {setAuthData} from './authSlice'           // ⬅ import the combined action
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'

export default function RegisterForm() {
  const [state, setState] = useState({
    userName: '',
    password: '',
    confirm: '',
  })

  const [register, {isLoading}] = useRegisterMutation()
  const dispatch = useAppDispatch()

  async function submit(e: FormEvent) {
    e.preventDefault()

    if (state.password !== state.confirm) {
      alert('Passwords differ!')
      return
    }

    try {
      /* backend returns {role:'employee'} + sets HttpOnly cookie */
      const {role} = await register({
        userName: state.userName,
        password: state.password,
      }).unwrap()

      dispatch(setAuthData({isAuthenticated: true, role}))
      // optional: clear local form
      // setState({userName:'', password:'', confirm:''})
    } catch {
      alert('Registration failed')
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

      <div className="grid gap-1">
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input
          id="confirm"
          type="password"
          value={state.confirm}
          onChange={(e) => setState({...state, confirm: e.target.value})}
          required
        />
      </div>

      <Button disabled={isLoading}>
        {isLoading ? '…' : 'Register'}
      </Button>
    </form>
  )
}
