import { request } from "@/utils/checkResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type TResetPasswordDataState = {
  password: string;
  token: string;
}

export type TResetPasswordResponse = {
  success: boolean;
  message: string;
}

export const resetPasswordSend = createAsyncThunk<TResetPasswordResponse, TResetPasswordDataState, { rejectValue: string } >(
  'resetPassword/resetPasswordSend',
  async (data: TResetPasswordDataState , { rejectWithValue }) => {
    const body = data;

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const resetPasswordResponse = (await request('/api/password-reset/reset', options)) as TResetPasswordResponse;
      return resetPasswordResponse;
    }
    catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка восстановления пароля'
      );
    }
  }
);

