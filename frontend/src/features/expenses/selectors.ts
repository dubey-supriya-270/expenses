import {createSelector} from '@reduxjs/toolkit'
import type {RootState} from '../../app/store'
import {usePagination} from '../../hooks/usePagination'
import {useMemo} from 'react'
import type { Expense } from '../../types'
import { useSelector } from 'react-redux'

export const selectUI = (state: RootState) => state.expenses
export const selectPage = createSelector(selectUI, (ui) => ui.page)
export const selectPageSize = createSelector(selectUI, (ui) => ui.pageSize)

/* Convenience React hook that marries RTK Query result with pagination */
export function usePagedData(expenses: Expense[] = []) {
  const page = selectPage(useSelector((s: RootState) => s))
  const pageSize = selectPageSize(useSelector((s: RootState) => s))
  return useMemo(
    () => usePagination(expenses, page, pageSize),
    [expenses, page, pageSize],
  )
}
