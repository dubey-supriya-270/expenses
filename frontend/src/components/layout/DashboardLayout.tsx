// src/components/layout/DashboardLayout.tsx
import {Outlet} from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* fixed sidebar on ≥md */}
      <Sidebar />

      {/* content column */}
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
