import { Urls } from '@/utils/urls';
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
  async (ingredients: string[]) => {
    const body = {
      ingredients: ingredients,
    };
    const res = await fetch(`${Urls.apiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const order = (await res.json()) as TCreateOrderResponse;

    return order.order.number;
  }
);
