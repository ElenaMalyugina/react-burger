import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrdersSocketState } from '@/utils/types';

// Начальное состояние
const initialState: TOrdersSocketState = {
  isConnected: false,
  success: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  isLoading: false,
  isToken: false,
};

// Создаём слайс
export const profileOrdersSocketSlice = createSlice({
  name: 'profileOrdersSocket',
  initialState,
  selectors: {
    profileOrders: (state) => state.orders,
    profileTotal: (state) => state.total,
    profileTotalToday: (state) => state.totalToday,
    profileOrderById: (state, id: string) =>
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
  profileOrdersSocketSlice.actions;

export const { profileOrders, profileTotal, profileTotalToday, profileOrderById } =
  profileOrdersSocketSlice.selectors;
