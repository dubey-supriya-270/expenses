import {useMemo} from 'react'

export function usePagination<T>(items: T[], page: number, pageSize: number) {
  return useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  )
}
