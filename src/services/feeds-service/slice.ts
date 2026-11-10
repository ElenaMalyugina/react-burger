import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

export type TOrdersSocketState = {
  isConnected: boolean;
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
  isLoading: boolean;
};

// Начальное состояние
const initialState: TOrdersSocketState = {
  isConnected: false,
  success: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  isLoading: false,
};

// Создаём слайс
export const feedSocketSlice = createSlice({
  name: 'feedSocket',
  initialState,
  selectors: {
    feedOrders: (state) => state.orders,
    feedTotal: (state) => state.total,
    feedTotalToday: (state) => state.totalToday,
    getOrderById: (state, id: string) =>
      state.orders.find((item) => item._id === id) ?? null,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.orders = [];
      state.total = 0;
      state.isLoading = false;
    },
    sendMessage: (state, action: PayloadAction<TOrdersSocketState>) => {
      console.log(state);
      console.log(action);
      // Middleware будет обрабатывать отправку
    },
    // Событийные редьюсеры
    onOpen: (state) => {
      state.isLoading = false;
      state.isConnected = true;
      state.error = null;
    },
    onMessage: (state, action: PayloadAction<TOrdersSocketState>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    onClose: (state) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
});

export const { connect, disconnect, sendMessage, onOpen, onMessage, onError, onClose } =
  feedSocketSlice.actions;

export const { feedOrders, feedTotal, feedTotalToday, getOrderById } =
  feedSocketSlice.selectors;
