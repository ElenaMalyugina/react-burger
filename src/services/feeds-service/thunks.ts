import { request } from '@/utils/checkResponse';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

type TOrderResponse = {
  data: TOrder;
};

export const getOrderById = createAsyncThunk<
  TOrder,
  string,
  { state: RootState; rejectValue: string }
>('feedSocket/getOrderById', async (orderId, { getState, rejectWithValue }) => {
  const cached = getState().feedSocket.orders.find((item) => item._id === orderId);

  if (cached) {
    return cached;
  }

  try {
    const res = (await request(`/api/ordres/${orderId}`)) as TOrderResponse;

    if (!Array.isArray(res.data)) {
      throw new Error('Поле data не содержит инфо о заказе');
    }
    return res.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка при загрузке данных заказа'
    );
  }
});
