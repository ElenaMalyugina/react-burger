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
  'authSend/authSend',
  async (_, { rejectWithValue }) => {
    const options: Record<string, unknown> = {
      method: 'GET',
    };

    try {
      const authResponse = (await fetchWithRefresh(
        '/api/auth/user',
        options
      )) as TAuthResponse;

      return authResponse;
    } catch (error: unknown) {
      return rejectWithValue(error instanceof Error ? error.message : 'Вход запрещен');
    }
  }
);
