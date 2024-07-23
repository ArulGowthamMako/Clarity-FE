import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
};

// Load initial state from localStorage if available
const persistedAuthState = localStorage.getItem('authState')
  ? JSON.parse(localStorage.getItem('authState') as string)
  : initialState;

const authSlice = createSlice({
  name: 'auth',
  initialState: persistedAuthState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.token = action.payload;
      // Persist the state in localStorage
      localStorage.setItem('authState', JSON.stringify(state));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      // Clear the state from localStorage
      localStorage.removeItem('authState');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
