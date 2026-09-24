import { createSlice } from '@reduxjs/toolkit';

import { sendOrder } from './thunks';

type TCreateOrderState = {
  orderNum: number | null;
  loading: boolean;
  error: string | null;
};

const initialState: TCreateOrderState = {
  orderNum: null,
  loading: false,
  error: null as string | null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    createOrder: (state) => state.orderNum ?? null,
    createOrderError: (state) => state.error ?? null,
    createOrderLoading: (state) => state.loading ?? false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderNum = action.payload;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const { createOrder, createOrderLoading, createOrderError } =
  orderSlice.selectors;
