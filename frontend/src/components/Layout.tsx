import {Link, Outlet} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Menu} from 'lucide-react'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b px-4 py-2 flex items-center gap-4">
        <Button size="icon" variant="ghost" asChild>
          <Link to="/">
            <Menu className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-semibold tracking-tight text-lg">Expense Tracker</h1>
        <nav className="ml-auto flex gap-3">
          <Button variant="link" asChild>
            <Link to="/expenses">Expenses</Link>
          </Button>
          <Button variant="link" asChild>
            <Link to="/analytics">Analytics</Link>
          </Button>
        </nav>
      </header>

      {/* Routed pages */}
      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
