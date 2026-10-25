import { request } from '@/utils/checkResponse';
import { saveAuthTokens } from '@/utils/token';
import { createAsyncThunk } from '@reduxjs/toolkit';

export type TLoginDataState = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
  success: boolean;
};

export const loginSend = createAsyncThunk<TLoginResponse, TLoginDataState, { rejectValue: string } >(
  'login/loginSend',
  async (userData: TLoginDataState , { rejectWithValue }) => {
    const body = userData;

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const loginResponse = (await request('/api/auth/login', options)) as TLoginResponse;

      const accessToken = loginResponse.accessToken;
      const refreshToken = loginResponse.refreshToken;

      saveAuthTokens(accessToken, refreshToken);

      return loginResponse;
    } catch (error: unknown) {

      return rejectWithValue(
        error instanceof Error ? error.message : 'Вход запрещен'
      );
    }
  }
);
