// src/services/feed-socket/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  feedSocketSlice,
  connect,
  disconnect,
  onOpen,
  onMessage,
  onError,
  onClose,
  setActiveOrder,
  clearActiveOrder,
  feedOrders,
  feedTotal,
  feedTotalToday,
  getActiveOrder,
  getIsOrders,
} from './slice';
import { getOrderById } from './thunks';

import type { TOrder, TOrdersSocketState } from '@/utils/types';

const order = {
  _id: 'order-1',
  number: 12345,
  name: 'Краторный люминесцентный бургер',
  status: 'done',
  ingredients: ['bun-1', 'sauce-1'],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:01:00.000Z',
} as TOrder;

const socketPayload: TOrdersSocketState = {
  orders: [order],
  total: 100,
  totalToday: 5,
} as never;

const runReducer = (
  action: Parameters<typeof feedSocketSlice.reducer>[1]
): TOrdersSocketState =>
  feedSocketSlice.reducer(feedSocketSlice.getInitialState(), action);

const runAll = (
  ...actions: Parameters<typeof feedSocketSlice.reducer>[1][]
): TOrdersSocketState =>
  actions.reduce(
    (state, action) => feedSocketSlice.reducer(state, action),
    feedSocketSlice.getInitialState()
  );

describe('feedSocketSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(feedSocketSlice.getInitialState()).toEqual({
        isConnected: false,
        success: false,
        orders: [],
        activeOrder: null,
        activeOrderError: null,
        total: 0,
        totalToday: 0,
        error: null,
        isLoading: false,
        isToken: false,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = feedSocketSlice.reducer(feedSocketSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(feedSocketSlice.getInitialState());
    });
  });

  describe('управляющие редьюсеры', () => {
    it('connect: включает isLoading и сбрасывает ошибку', () => {
      const state = runReducer(connect());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.isConnected).toBe(false);
    });

    it('disconnect: сбрасывает соединение и данные, не трогает error', () => {
      const opened = runAll(connect(), onOpen(), onMessage(socketPayload));
      const state = feedSocketSlice.reducer(opened, disconnect());

      expect(state.isConnected).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('событийные редьюсеры', () => {
    it('onOpen: соединение установлено, загрузка выключена', () => {
      const state = runAll(connect(), onOpen());

      expect(state.isConnected).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('onMessage: сохраняет orders, total и totalToday', () => {
      const state = runAll(onOpen(), onMessage(socketPayload));

      expect(state.orders).toEqual([order]);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(5);
    });

    it('onError: записывает ошибку и выключает загрузку', () => {
      const state = runReducer(onError('Соединение потеряно'));

      expect(state.error).toBe('Соединение потеряно');
      expect(state.isLoading).toBe(false);
    });

    it('onClose: сбрасывает isConnected и isLoading, не чистит orders', () => {
      const state = runAll(onOpen(), onMessage(socketPayload), onClose());

      expect(state.isConnected).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([order]);
    });
  });

  describe('activeOrder', () => {
    const withOrders = runAll(onOpen(), onMessage(socketPayload));

    it('setActiveOrder: находит заказ по _id', () => {
      const state = feedSocketSlice.reducer(withOrders, setActiveOrder('order-1'));

      expect(state.activeOrder).toEqual(order);
    });

    it('setActiveOrder: несуществующий id даёт null', () => {
      const state = feedSocketSlice.reducer(withOrders, setActiveOrder('no-such-id'));

      expect(state.activeOrder).toBe(null);
    });

    it('clearActiveOrder: очищает заказ и ошибку', () => {
      let state = feedSocketSlice.reducer(withOrders, setActiveOrder('order-1'));
      state = feedSocketSlice.reducer(state, clearActiveOrder());

      expect(state.activeOrder).toBe(null);
      expect(state.activeOrderError).toBe(null);
    });
  });

  describe('getOrderById', () => {
    it('pending: сбрасывает activeOrder и ошибку', () => {
      const state = runReducer(getOrderById.pending('', 'request-1'));

      expect(state.activeOrder).toBe(null);
      expect(state.activeOrderError).toBe(null);
    });

    it('fulfilled: сохраняет заказ', () => {
      const state = runReducer(getOrderById.fulfilled(order, 'request-1', '1'));

      expect(state.activeOrder).toEqual(order);
      expect(state.activeOrderError).toBe(null);
    });

    it('rejected: ставит сообщение об ошибке', () => {
      const state = runReducer(getOrderById.rejected(null, 'request-1', '1'));

      expect(state.activeOrder).toBe(null);
      expect(state.activeOrderError).toBe('Заказ не найден');
    });
  });

  describe('селекторы', () => {
    const filled = runAll(onOpen(), onMessage(socketPayload));
    const rootState = { [feedSocketSlice.name]: filled } as never;
    const emptyRootState = {
      [feedSocketSlice.name]: feedSocketSlice.getInitialState(),
    } as never;

    it('feedOrders / feedTotal / feedTotalToday отдают данные', () => {
      expect(feedOrders(rootState)).toEqual([order]);
      expect(feedTotal(rootState)).toBe(100);
      expect(feedTotalToday(rootState)).toBe(5);
    });

    it('getIsOrders: true, если заказы есть, и false на пустом стейте', () => {
      expect(getIsOrders(rootState)).toBe(true);
      expect(getIsOrders(emptyRootState)).toBe(false);
    });

    it('getActiveOrder на пустом стейте — null', () => {
      expect(getActiveOrder(emptyRootState)).toBe(null);
    });
  });
});
