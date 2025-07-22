import {Link} from 'react-router-dom'
import LoginForm from '../features/auth/LoginForm'

export default function Home() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Expense Tracker</h1>
      <LoginForm />
      <nav className="flex gap-4">
        <Link to="/expenses" className="underline text-blue-600">
          Expenses
        </Link>
        <Link to="/analytics" className="underline text-blue-600">
          Analytics
        </Link>
      </nav>
    </div>
  )
}
