import { request } from '@/utils/checkResponse';
import { clearTokens, getRefreshToken } from '@/utils/token';
import { createAsyncThunk } from '@reduxjs/toolkit';

export type TLogoutState = {
  token: string | null;
};

export type TLogoutResponse = {
  success: boolean;
  message: string;
};

export const logoutSend = createAsyncThunk<TLogoutResponse, void, { rejectValue: string } >(
  'logout/logoutSend',
  async (_ , { rejectWithValue }) => {
    const body:TLogoutState = {token: getRefreshToken()};

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const logoutResponse = (await request('/api/auth/logout', options)) as TLogoutResponse;

      clearTokens();

      return logoutResponse;
    } catch (error: unknown) {

      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода из системы'
      );
    }
  }
);
