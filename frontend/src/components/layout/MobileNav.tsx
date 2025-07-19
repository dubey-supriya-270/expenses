// src/components/layout/MobileNav.tsx
import {Sheet, SheetTrigger, SheetContent} from '@/components/ui/sheet'
import {Button} from '@/components/ui/button'
import Sidebar from './Sidebar'
import {Menu} from 'lucide-react'

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-60">
        <Sidebar className="md:hidden" />
      </SheetContent>
    </Sheet>
  )
}
