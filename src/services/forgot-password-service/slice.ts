import { createSlice } from '@reduxjs/toolkit';

import { forgotPasswordSend } from './thunks';

type TForgotPasswordResponseState = {
  response: unknown;
  loading: boolean;
  error: string | null;
  resetRequested: boolean;
};

const initialState: TForgotPasswordResponseState = {
  response: null,
  loading: false,
  error: null as string | null,
  resetRequested: false,
};

export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    resetForgotPasswordState: (state) => {
      state.resetRequested = false;
      state.response = null;
    },
  },
  selectors: {
    forgotPasswordResult: (state) => state.response ?? null,
    forgotPasswordError: (state) => state.error ?? null,
    forgotPasswordLoading: (state) => state.loading,
    forgotPasswordRequested: (state) => state.resetRequested,
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.resetRequested = true;
      })
      .addCase(forgotPasswordSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка восстановления пароля';
      });
  },
});

export const {
  forgotPasswordResult,
  forgotPasswordLoading,
  forgotPasswordError,
  forgotPasswordRequested,
} = forgotPasswordSlice.selectors;

export const { resetForgotPasswordState } = forgotPasswordSlice.actions;
