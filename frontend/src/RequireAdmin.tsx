// RequireAdmin.tsx - Pure Redux implementation
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

interface RequireAdminProps {
  children: React.ReactNode
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  // Get auth state from Redux
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated)
  const role = useSelector((state: any) => state.auth.role)

  // Simple loading check - you can adjust this timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100) // Small delay to ensure Redux state is initialized

    return () => clearTimeout(timer)
  }, [])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if user has admin role
  if (role !== 'admin') {
    return <Navigate to="/unauthorized" replace />
  }

  // User is authenticated and has admin role
  return <>{children}</>
}