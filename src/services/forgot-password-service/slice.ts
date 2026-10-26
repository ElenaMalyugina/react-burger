import { createSlice } from '@reduxjs/toolkit';

import { forgotPasswordSend } from './thunks';

type TForgotPasswordResponseState = {
  response: unknown;
  loading: boolean;
  error: string | null;
}

const initialState: TForgotPasswordResponseState = {
  response: null,
  loading: false,
  error: null as string | null,
}

export const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {},
  selectors: {
    forgotPasswordResult: (state) => state.response ?? null,
    forgotPasswordError: (state) => state.error ?? null,
    forgotPasswordLoading: (state) => state.loading ?? false,
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
      })
      .addCase(forgotPasswordSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка восстановления пароля';
      });
  },
});

export const { forgotPasswordResult, forgotPasswordLoading, forgotPasswordError } =
  forgotPasswordSlice.selectors;
