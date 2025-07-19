import {useState, type FormEvent} from 'react'
import {useAddExpenseMutation} from '../../api/expenseApi'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'

export default function ExpenseForm() {
  const [addExpense, {isLoading}] = useAddExpenseMutation()
  const [state, setState] = useState({
    description: '',
    category: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  })

  async function submit(e: FormEvent) {
    e.preventDefault()
    const {description, category, amount, date} = state
    await addExpense({description, category, amount: Number(amount), date})
    // sheet auto-closes via parent
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-1">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={state.description}
          onChange={(e) => setState({...state, description: e.target.value})}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={state.category}
          onChange={(e) => setState({...state, category: e.target.value})}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={state.date}
          onChange={(e) => setState({...state, date: e.target.value})}
          required
        />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={state.amount}
          onChange={(e) => setState({...state, amount: e.target.value})}
          required
        />
      </div>

      <Button disabled={isLoading}>
        {isLoading ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}
