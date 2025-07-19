// src/components/layout/Topbar.tsx
import {Button} from '@/components/ui/button'
import MobileNav from './MobileNav'
import {TOP_ACTIONS} from '@/constants/nav'
import {useLogoutMutation} from '@/api/expenseApi'
import {useAppDispatch} from '@/app/hooks'
import {setAuthenticated} from '@/features/auth/authSlice'

export default function Topbar() {
  const [logout] = useLogoutMutation()
  const dispatch = useAppDispatch()

  async function handleAction(id: string) {
    if (id === 'logout') {
      await logout().unwrap()
      dispatch(setAuthenticated(false))
    }
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b px-4 py-2 bg-background">
      <MobileNav />
      <h1 className="font-semibold text-base hidden md:block">Expense Tracker</h1>

      <nav className="flex items-center gap-2 ml-auto">
        {TOP_ACTIONS.map(({id, label, icon: Icon}) => (
          <Button key={id} variant="ghost" size="icon" aria-label={label} onClick={() => handleAction(id)}>
            <Icon className="h-5 w-5" />
          </Button>
        ))}
      </nav>
    </header>
  )
}
