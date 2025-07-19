import {useState} from 'react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {Button} from '@/components/ui/button'
import {Plus} from 'lucide-react'
import ExpenseForm from './ExpenseForm'

export default function ExpenseSheet() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[460px]">
        <SheetHeader>
          <SheetTitle>New Expense</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ExpenseForm />
        </div>
      </SheetContent>
    </Sheet>
  )
}
