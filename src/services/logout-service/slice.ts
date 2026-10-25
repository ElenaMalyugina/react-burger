import { createSlice } from '@reduxjs/toolkit';

import { logoutSend } from './thunks';

type TLogoutResponse = {
  response: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: TLogoutResponse = {
  response: null,
  loading: false,
  error: null as string | null,
}

export const logoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {},
  selectors: {
    logoutResult: (state) => state.response ?? null,
    logoutError: (state) => state.error ?? null,
    logoutLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.message;
      })
      .addCase(logoutSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось войти';
      });
  },
});

export const { logoutResult, logoutLoading, logoutError } =
  logoutSlice.selectors;
