import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'
import { useMemo, useEffect } from 'react'
import { useGetAnalyticsQuery } from '../api/expenseApi'
import type { Expense } from '../types'
import { useLocation } from 'react-router-dom'

export default function AnalyticsDashboard() {
  const location = useLocation()
  const { data: expenses, isLoading, isError, refetch } = useGetAnalyticsQuery()

  // ✅ Refresh data on route change
  useEffect(() => {
    refetch()
  }, [location.pathname, refetch])

  // ✅ Group by month
  const monthlyData = useMemo(() => {
    if (!expenses) return []
    const monthMap: Record<string, number> = {}

    expenses.forEach((e: Expense) => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short' })
      const amount = parseFloat(e.amount as any) || 0
      monthMap[month] = (monthMap[month] || 0) + amount
    })

    return Object.entries(monthMap).map(([name, total]) => ({ name, total }))
  }, [expenses])

  // ✅ Group by category
  const categoryData = useMemo(() => {
    if (!expenses) return []
    const catMap: Record<string, number> = {}

    expenses.forEach((e: Expense) => {
      const amount = parseFloat(e.amount as any) || 0
      catMap[e.category] = (catMap[e.category] || 0) + amount
    })

    return Object.entries(catMap).map(([name, total]) => ({ name, total }))
  }, [expenses])

  if (isLoading) return <p className="p-6">Loading analytics...</p>
  if (isError) return <p className="p-6 text-red-600">Failed to load analytics.</p>

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-4">Expense Analytics</h1>

      {/* Monthly Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" name="Total (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Expenses by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#82ca9d" name="Total (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
