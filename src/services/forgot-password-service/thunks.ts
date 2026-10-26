import { request } from "@/utils/checkResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";

export type TForgotPasswordDataState = {
  email: string;
}

export type TForgotPasswordResponse = {
  success: boolean;
  message: string;
}

export const forgotPasswordSend = createAsyncThunk<TForgotPasswordResponse, TForgotPasswordDataState, { rejectValue: string } >(
  'forgotPassword/forgotPasswordSend',
  async (data: TForgotPasswordDataState , { rejectWithValue }) => {
    const body = data;

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const forgotPasswordResponse = (await request('/api/password-reset', options)) as TForgotPasswordResponse;
      return forgotPasswordResponse;
    }
    catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка восстановления пароля'
      );
    }
  }
);

