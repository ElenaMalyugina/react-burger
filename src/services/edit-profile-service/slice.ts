import { createSlice } from '@reduxjs/toolkit';

import { editProfileSend, type TEditProfileResponse } from './thunks';

type TEditProfileResponseState = {
  response: TEditProfileResponse | null;
  loading: boolean;
  isUpdated: boolean;
  error: string | null;
};

const initialState: TEditProfileResponseState = {
  response: null,
  loading: false,
  isUpdated: false,
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
    editProfileIsUpdated: (state) => state.isUpdated ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProfileSend.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isUpdated = false;
      })
      .addCase(editProfileSend.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
        state.isUpdated = true;
      })
      .addCase(editProfileSend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка обновления профиля';
        state.isUpdated = false;
      });
  },
});

export const {
  editProfileResult,
  editProfileLoading,
  editProfileError,
  editProfileIsUpdated,
} = editProfileSlice.selectors;
