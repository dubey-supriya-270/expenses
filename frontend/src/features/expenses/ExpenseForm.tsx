function isErrorWithMessage(
  error: unknown
): error is { data: { message: string } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as any).data?.message === 'string'
  )
}

import { useState, type FormEvent } from 'react'
import { useAddExpenseMutation } from '../../api/expenseApi'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { CATEGORIES } from '@/constants/category'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ExpenseForm({ onClose }: { onClose: () => void }) {
  const [addExpense, { isLoading }] = useAddExpenseMutation()
  const [state, setState] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  })

  async function submit(e: FormEvent) {
    e.preventDefault()
    const { description, category, amount, date } = state

    
    try {
      await addExpense({
        description,
        category,
        amount: Number(amount),
        date,
      })

      onClose()
      toast.success(`Expense saved successfully ${amount}`)
    } catch (err) {
      if (isErrorWithMessage(err)) {
        toast.error(err.data.message)
      } else {
        toast.error('Failed to save expense')
      }
    }
  }

  return (
    <Card className="max-w-md mx-auto p-4 rounded-2xl shadow-lg border bg-white dark:bg-neutral-900">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Add New Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-5">
          {/* Description */}
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="E.g., Client lunch, office supply"
              value={state.description}
              onChange={(e) => setState({ ...state, description: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="grid gap-1.5">
            <Label htmlFor="category">Category</Label>
            <div className="w-full">
              <Select
                onValueChange={(val) => setState({ ...state, category: val })}
                value={state.category}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="grid gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={state.date}
              onChange={(e) => setState({ ...state, date: e.target.value })}
              required
            />
          </div>

          {/* Amount */}
          <div className="grid gap-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount in ₹"
              value={state.amount}
              onChange={(e) => setState({ ...state, amount: e.target.value })}
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {isLoading ? 'Saving…' : 'Save Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
