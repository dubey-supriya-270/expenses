export interface Expense {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  description?: string;
  date: string;
  approved: boolean;
  created_at: Date;
}

export type Filter = {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: number;      // <-- add it here
};
export type IExpenseCreate = Omit<Expense, 'id' | 'approved' | 'created_at' >