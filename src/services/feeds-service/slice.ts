import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Order = {
  _id: string;
  ingredients: string[];
  status: 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

type OrdersSocketState = {
  isConnected: boolean;
  messages: Order[];
  error: string | null;
  isLoading: boolean;
};

// Начальное состояние
const initialState: OrdersSocketState = {
  isConnected: false,
  messages: [],
  error: null,
  isLoading: false,
};

// Создаём слайс
export const feedSocketSlice = createSlice({
  name: 'feedSocket',
  initialState,
  selectors: {
    feedOrders: (state) => state.messages,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.messages = [];
      state.isLoading = false;
    },
    sendMessage: (state, action: PayloadAction<Order>) => {
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
    onMessage: (state, action: PayloadAction<Order>) => {
      state.messages.push(action.payload);
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

export const { feedOrders } = feedSocketSlice.selectors;
