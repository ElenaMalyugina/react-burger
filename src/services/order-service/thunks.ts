import { request } from '@/utils/checkResponse'; // проверь, что путь к файлу верный
import { createAsyncThunk } from '@reduxjs/toolkit';

type TCreateOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

export const sendOrder = createAsyncThunk<number, string[]>(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    const body = {
      ingredients,
    };

    const options: Record<string, unknown> = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    };

    try {
      const order = (await request('/api/orders', options)) as TCreateOrderResponse;

      return order.order.number;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось создать заказ'
      );
    }
  }
);
