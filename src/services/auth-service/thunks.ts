import { fetchWithRefresh } from '@/utils/checkResponse';
import { createAsyncThunk } from '@reduxjs/toolkit';

export type TAuthResponse = {
  user: {
    email: string;
    name: string;
  };
  success: boolean;
};

export const authSend = createAsyncThunk<TAuthResponse, null, { rejectValue: string }>(
  'auth/authSend',
  async (_, { rejectWithValue }) => {
    const options: Record<string, unknown> = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };

    try {
      //const accessToken = getAccessToken();
      //const refreshToken = getRefreshToken();

      //где проверять вообще наличие токенов?

      const authResponse = (await fetchWithRefresh(
        '/api/auth/login',
        options
      )) as TAuthResponse;

      return authResponse;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Вход запрещен');
    }
  }
);
