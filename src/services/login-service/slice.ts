import { createSlice } from '@reduxjs/toolkit';

import { loginSend } from './thunks';

type TLoginResponseDataState = {
  response: unknown;
  loading: boolean;
  error: string | null;
}

const initialState: TLoginResponseDataState = {
  response: null,
  loading: false,
  error: null as string | null,
}

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  selectors: {
    loginResult: (state) => state.response ?? null,
    loginError: (state) => state.error ?? null,
    loginLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(loginSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Не удалось войти';
      });
  },
});

export const { loginResult, loginLoading, loginError } =
  loginSlice.selectors;
