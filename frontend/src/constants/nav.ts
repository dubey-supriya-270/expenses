// src/constants/nav.ts
import {
    Home,
    Receipt,
    BarChart3,
    LogOut
  } from 'lucide-react'          // shadcn uses lucide by default
  
  export type NavItem = {
    label: string
    to: string
    icon: React.ComponentType<{ className?: string }>
    roles?: ('employee' | 'admin')[]
  }
  
  export const NAV_ITEMS: NavItem[] = [
    { label: 'Home',       to: '/',         icon: Home },
    { label: 'Expenses',   to: '/expenses', icon: Receipt },
    { label: 'Analytics',  to: '/analytics',icon: BarChart3 , roles: ['admin']},
  ]
  
  export const TOP_ACTIONS = [
    {id: 'logout', label: 'Logout', icon: LogOut},
  ]