import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

interface UIState {
  page: number
  pageSize: number
  showForm: boolean
}
const initialState: UIState = {page: 1, pageSize: 10, showForm: false}

export const expensesSlice = createSlice({
  name: 'expensesUI',
  initialState,
  reducers: {
    setPage: (s, a: PayloadAction<number>) => void (s.page = a.payload),
    toggleForm: (s) => void (s.showForm = !s.showForm),
  },
})

export const {setPage, toggleForm} = expensesSlice.actions
export default expensesSlice.reducer
