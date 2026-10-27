import { createSlice } from '@reduxjs/toolkit';

import { authSend } from './thunks';

type TAuthResponseState = {
  response: unknown;
  loading: boolean;
  error: string | null;
};

const initialState: TAuthResponseState = {
  response: null,
  loading: false,
  error: null as string | null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    authResult: (state) => state.response ?? null,
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
        state.response = action.payload;
      })
      .addCase(authSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка обновления профиля';
      });
  },
});

export const { authResult, authLoading, authError } = authSlice.selectors;
