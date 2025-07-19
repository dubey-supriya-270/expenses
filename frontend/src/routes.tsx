import {lazy, Suspense} from 'react'
import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom'
import RequireAuth from './RequireAuth'
import RequireAdmin from './RequireAdmin'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Expenses = lazy(() => import('./pages/Expenses'))
const Analytics = lazy(() => import('./pages/AnalyticsDashboard'))
const DashboardLayout = lazy(
  () => import('./components/layout/DashboardLayout'),
)

export const router = createBrowserRouter([
  {path: '/', element: <Navigate to="/register" replace />},
  {path: '/login', element: <Login />},
  {path: '/register', element: <Register />},
  {
    element: <RequireAuth />,          // 🔒 guarded shell
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {path: '/expenses', element: <Expenses />},
          {path: '/analytics', element: <RequireAdmin>
            <Analytics />
          </RequireAdmin>},
        ]

      }
      
    ],
  },
  {path: '*', element: <Navigate to="/login" replace />},
])

export default function Routes() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
