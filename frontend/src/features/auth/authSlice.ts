// src/features/auth/authSlice.ts
import {createSlice, type PayloadAction} from '@reduxjs/toolkit'

export type UserRole = 'employee' | 'admin'

interface AuthState {
  isAuthenticated: boolean
  role: UserRole | null          // ⬅ new field
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,                    // unknown on first load
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, {payload}: PayloadAction<boolean>) {
      state.isAuthenticated = payload
    },
    setRole(state, {payload}: PayloadAction<UserRole | null>) {
      state.role = payload
    },
    /** convenience helper for login / logout */
    setAuthData(
      state,
      {payload}: PayloadAction<{isAuthenticated: boolean; role: UserRole | null}>,
    ) {
      state.isAuthenticated = payload.isAuthenticated
      state.role = payload.role
    },
  },
})

export const {setAuthenticated, setRole, setAuthData} = authSlice.actions
export default authSlice.reducer
