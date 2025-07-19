import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {expenseApi} from '../api/expenseApi'
import authReducer from '../features/auth/authSlice'
import expensesReducer from '../features/expenses/expensesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(expenseApi.middleware),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
