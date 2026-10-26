import { createSlice } from '@reduxjs/toolkit';

import { resetPasswordSend } from './thunks';

type TResetPasswordResponseState = {
  response: unknown;
  loading: boolean;
  error: string | null;
}

const initialState: TResetPasswordResponseState = {
  response: null,
  loading: false,
  error: null as string | null,
}

export const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {},
  selectors: {
    resetPasswordResult: (state) => state.response ?? null,
    resetPasswordError: (state) => state.error ?? null,
    resetPasswordLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPasswordSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(resetPasswordSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка восстановления пароля';
      });
  },
});

export const { resetPasswordResult, resetPasswordLoading, resetPasswordError } =
  resetPasswordSlice.selectors;
