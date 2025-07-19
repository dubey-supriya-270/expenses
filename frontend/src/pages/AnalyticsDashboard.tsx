import {useGetExpensesQuery} from '../api/expenseApi'
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'
import {useMemo} from 'react'

export default function AnalyticsDashboard() {
  const {data} = useGetExpensesQuery({page: 1, pageSize: 1000})
  const chartData = useMemo(
    () =>
      data?.items?.reduce<Record<string, number>>((acc, e) => {
        const month = new Date(e.date).toLocaleString('default', {month: 'short'})
        acc[month] = (acc[month] || 0) + e.amount
        return acc
      }, {}) ?? {},
    [data],
  )

  const rows = Object.entries(chartData).map(([name, total]) => ({name, total}))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={rows}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
