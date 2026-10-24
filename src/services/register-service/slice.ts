import { createSlice } from '@reduxjs/toolkit';

import { registerSend } from './thunks';

type TRegisterResponseDataState = {
  response: unknown;
  loading: boolean;
  error: string | null;
}

const initialState: TRegisterResponseDataState = {
  response: null,
  loading: false,
  error: null as string | null,
}

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  selectors: {
    registerResult: (state) => state.response ?? null,
    registerError: (state) => state.error ?? null,
    registerLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(registerSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const { registerResult, registerLoading, registerError } =
  registerSlice.selectors;
