import { createSlice } from '@reduxjs/toolkit';

import { editProfileSend } from './thunks';

type TEditProfileResponseState = {
  response: unknown;
  loading: boolean;
  error: string | null;
};

const initialState: TEditProfileResponseState = {
  response: null,
  loading: false,
  error: null as string | null,
};

export const editProfileSlice = createSlice({
  name: 'editProfile',
  initialState,
  reducers: {},
  selectors: {
    editProfileResult: (state) => state.response ?? null,
    editProfileError: (state) => state.error ?? null,
    editProfileLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProfileSend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfileSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(editProfileSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка обновления профиля';
      });
  },
});

export const { editProfileResult, editProfileLoading, editProfileError } =
  editProfileSlice.selectors;
