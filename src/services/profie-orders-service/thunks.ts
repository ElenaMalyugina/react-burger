import { fetchWithRefresh } from '@/utils/checkResponse';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TOrder } from '@/utils/types';

type TOrderResponse = {
  order: TOrder;
};

export const getOrderById = createAsyncThunk<
  TOrder,
  string,
  { state: RootState; rejectValue: string }
>('profileOrders/getOrderById', async (orderId, { getState, rejectWithValue }) => {
  const cached = getState().profileOrdersSocket.orders.find(
    (item) => item._id === orderId
  );

  if (cached) {
    return cached;
  }

  try {
    const res = (await fetchWithRefresh(`/api/orders/${orderId}`)) as TOrderResponse;

    if (!res.order) {
      throw new Error('Поле data не содержит инфо о заказе');
    }
    return res.order;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Ошибка при загрузке данных заказа'
    );
  }
});
