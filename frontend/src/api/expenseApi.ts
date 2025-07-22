import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {Expense} from '../types'

const baseUrl =
  import.meta.env.VITE_API_URL?.trim() 

export const expenseApi = createApi({
  reducerPath: 'expenseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,         
    credentials: 'include', 
  
  }),
  tagTypes: ['Expense', 'Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<{role: 'employee' | 'admin'}, {userName: string; password: string}>({
      query: (body) => ({url: 'user/sign-in', method: 'POST', body}),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<{role: 'employee' | 'admin'}, {userName: string; password: string}>({
        query: (body) => ({url: 'user/sign-up', method: 'POST', body}),
        invalidatesTags: ['Auth'],
      }),
    logout: builder.mutation<void, void>({
      query: () => ({url: 'user/logout', method: 'POST'}),
      invalidatesTags: ['Auth', 'Expense'],
    }),
    getExpenses: builder.query<
      {items: Expense[]; total: number},
      {page: number; pageSize: number}
    >({
      query: ({page, pageSize}) =>
        `expense?page=${page}&pageSize=${pageSize}`,
      transformResponse: (raw: any) => {
        const items: Expense[] = raw.data.map((e: any) => ({
          id: e.id,
          userId: e.user_id,
          description: e.description,
          category: e.category,
          amount: Number(e.amount),            // string → number
          date: e.date,                        // keep ISO string
          approved: e.approved,
          createdAt: e.created_at,
        }))
    
        return {
          items,
          total: raw.total,
          page: raw.page,
          limit: raw.limit,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({id}) => ({type: 'Expense' as const, id})),
              {type: 'Expense', id: 'PARTIAL-LIST'},
            ]
          : [{type: 'Expense', id: 'PARTIAL-LIST'}],
    }),
    addExpense: builder.mutation<Expense, Partial<Expense>>({
      query: (body) => ({
        url: 'expense',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { status: number; success: boolean; data: Expense }) => response.data,
      invalidatesTags: [{ type: 'Expense', id: 'PARTIAL-LIST' }],
    }),
    approveExpense: builder.mutation<void, {id: number}>({
      query: ({id}) => ({url: `expense/${id}/approve`, method: 'PUT'}),
      invalidatesTags: (_res, _err, {id}) => [
        {type: 'Expense', id},               // refresh this row
        {type: 'Expense', id: 'PARTIAL-LIST'},
      ],
    }),
    getAnalytics: builder.query<Expense[], void>({
      query: () => 'expense/analytics',
      transformResponse: (raw: { data: Expense[] }) => raw.data,
      providesTags: ['Expense'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetExpensesQuery,
  useAddExpenseMutation,
  useApproveExpenseMutation,
  useGetAnalyticsQuery
} = expenseApi
