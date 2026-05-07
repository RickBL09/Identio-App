import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { AuthRepository } from '@/repositories/auth.repository';
import type { LoginInput, RegisterInput } from '@/services/auth.service';
import type { User } from '@/types/domain';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
};

export const initializeAuthThunk = createAsyncThunk('auth/initialize', async () => {
  const token = await AuthRepository.getToken();
  return token;
});

export const loginThunk = createAsyncThunk('auth/login', async (payload: LoginInput) => {
  const response = await AuthRepository.login(payload);
  return response;
});

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterInput) => {
    const response = await AuthRepository.register(payload);
    return response;
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await AuthRepository.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuthThunk.fulfilled, (state, action) => {
        state.token = action.payload ?? null;
        state.isAuthenticated = Boolean(action.payload);
        state.isInitialized = true;
      })
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error en login';
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Error en registro';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
