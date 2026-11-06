import { createSlice } from '@reduxjs/toolkit';

import { authSend, type TAuthResponse } from './thunks';

type TAuthResponseState = {
  authUserData: TAuthResponse | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TAuthResponseState = {
  authUserData: null,
  isAuthChecked: false,
  loading: false,
  error: null as string | null,
};

export const authSlice = createSlice({
  name: 'authSend',
  initialState,
  reducers: {},
  selectors: {
    authResult: (state) => state.authUserData ?? null,
    isAuthResult: (state) => state.isAuthChecked,
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
        state.isAuthChecked = true;
        state.authUserData = action.payload;
      })
      .addCase(authSend.rejected, (state, action) => {
        state.loading = false;
        state.isAuthChecked = true;
        state.authUserData = null;
        state.error = action.payload ?? 'Ошибка обновления профиля';
      });
  },
});

export const { authResult, isAuthResult, authLoading, authError } = authSlice.selectors;
