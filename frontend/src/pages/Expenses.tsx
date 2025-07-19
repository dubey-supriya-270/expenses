import ExpenseTable from '../features/expenses/ExpenseTable'
import ExpenseSheet from '../features/expenses/ExpenseSheet'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'

export default function Expenses() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">Expenses</CardTitle>
        <ExpenseSheet />
      </CardHeader>
      <CardContent>
        <ExpenseTable />
      </CardContent>
    </Card>
  )
}
