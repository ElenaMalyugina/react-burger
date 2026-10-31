import { createSlice } from '@reduxjs/toolkit';
import { authSend, type TAuthResponse } from './thunks';


type TAuthResponseState = {
  authUserData: TAuthResponse | null;
  isAuth:  boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TAuthResponseState = {
  authUserData: null,
  isAuth: false,
  loading: false,
  error: null as string | null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    authResult: (state) => state.authUserData ?? null,
    isAuthResult: (state) => state.isAuth ?? false,
    authError: (state) => state.error ?? null,
    authLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(authSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authSend.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.authUserData = action.payload;
      })
      .addCase(authSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка обновления профиля';
      });
  },
});

export const { authResult, authLoading, authError } = authSlice.selectors;
