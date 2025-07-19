// src/components/layout/Sidebar.tsx
import {NavLink} from 'react-router-dom'
import {cn} from '@/lib/utils'
import {useAppSelector} from '@/app/hooks'
import {NAV_ITEMS} from '@/constants/nav'

export default function Sidebar({className}: {className?: string}) {
  const role = useAppSelector((s) => s.auth.role) // 'employee' | 'admin'

  return (
    <aside className={cn('hidden md:flex shrink-0 flex-col w-60 border-r bg-muted/40', className)}>
      <div className="p-4 text-lg font-semibold">Expense Tracker</div>
      <nav className="flex-1 px-2 space-y-1">
        {NAV_ITEMS
          .filter((n) => !n.roles || n.roles.includes(role!))
          .map(({to, label, icon: Icon}) => (
            <NavLink
              key={to}
              to={to}
              className={({isActive}) =>
                cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground',
                  isActive && 'bg-accent text-accent-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
      </nav>
    </aside>
  )
}
