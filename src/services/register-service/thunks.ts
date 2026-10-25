import { request } from '@/utils/checkResponse';
import { createAsyncThunk } from '@reduxjs/toolkit';

export type TRegisterDataState = {
  name: string;
  email: string;
  password: string;
};

type TRegisterResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
  success: boolean;
};

export const registerSend = createAsyncThunk<TRegisterResponse, TRegisterDataState, { rejectValue: string } >(
  'register/registerSend',
  async (userData: TRegisterDataState , { rejectWithValue }) => {
    const body = userData;

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const regResponse = (await request('/api/auth/register', options)) as TRegisterResponse;

      return regResponse;
    } catch (error: unknown) {

      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);
