import { fetchWithRefresh } from '@/utils/checkResponse';
import { createAsyncThunk } from '@reduxjs/toolkit';

export type TProfileDataState = {
  name: string;
  email: string;
  password: string;
};

export type TEditProfileResponse = {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
};

export const editProfileSend = createAsyncThunk<
  TEditProfileResponse,
  TProfileDataState,
  { rejectValue: string }
>(
  'editProfile/editProfileSend',
  async (data: TProfileDataState, { rejectWithValue }) => {
    const body = data;

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const editProfileResponse = (await fetchWithRefresh(
        '/api/password-reset/reset',
        options
      )) as TEditProfileResponse;
      return editProfileResponse;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось обновить данные'
      );
    }
  }
);
