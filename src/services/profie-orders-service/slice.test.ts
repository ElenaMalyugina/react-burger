// src/services/profile-orders-socket/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  profileOrdersSocketSlice,
  connect,
  disconnect,
  onOpen,
  onMessage,
  onError,
  onClose,
  setActiveOrder,
  clearActiveOrder,
  profileOrders,
  profileTotal,
  profileTotalToday,
  getActiveOrder,
  getIsOrders,
} from './slice';
import { getOrderById } from './thunks';

import type { TOrdersSocketState, TOrder } from '@/utils/types';

// ---------- типы ----------

type SliceState = TOrdersSocketState;
type SliceAction = Parameters<typeof profileOrdersSocketSlice.reducer>[1];
type RootState = { [profileOrdersSocketSlice.name]: SliceState };

// ---------- фикстуры ----------

const order: TOrder = {
  _id: 'order-1',
  ingredients: ['bun-1', 'sauce-1'],
  status: 'done',
  name: 'Краторный люминесцентный бургер',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:01:00.000Z',
  number: 12345,
};

const socketPayload: TOrdersSocketState = {
  orders: [order],
  total: 100,
  totalToday: 5,
} as unknown as TOrdersSocketState;

// ---------- помощники (с явными типами) ----------

const runReducer = (action: SliceAction): SliceState =>
  profileOrdersSocketSlice.reducer(profileOrdersSocketSlice.getInitialState(), action);

const runAll = (...actions: SliceAction[]): SliceState =>
  actions.reduce<SliceState>(
    (state, action) => profileOrdersSocketSlice.reducer(state, action),
    profileOrdersSocketSlice.getInitialState()
  );

const toRootState = (sliceState: SliceState): RootState => ({
  [profileOrdersSocketSlice.name]: sliceState,
});

describe('profileOrdersSocketSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', (): void => {
      expect(profileOrdersSocketSlice.getInitialState()).toEqual({
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

    it('неизвестный экшен не меняет состояние', (): void => {
      const state: SliceState = runReducer({ type: 'UNKNOWN_ACTION' });

      expect(state).toEqual(profileOrdersSocketSlice.getInitialState());
    });
  });

  describe('управляющие редьюсеры', () => {
    it('connect: включает isLoading и сбрасывает ошибку', (): void => {
      const state: SliceState = runReducer(connect());

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.isConnected).toBe(false);
    });

    it('disconnect: сбрасывает соединение и данные', (): void => {
      const opened: SliceState = runAll(connect(), onOpen(), onMessage(socketPayload));
      const state: SliceState = profileOrdersSocketSlice.reducer(opened, disconnect());

      expect(state.isConnected).toBe(false);
      expect(state.orders).toEqual([]);
      expect(state.total).toBe(0);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('событийные редьюсеры', () => {
    it('onOpen: соединение установлено, загрузка выключена', (): void => {
      const state: SliceState = runAll(connect(), onOpen());

      expect(state.isConnected).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('onMessage: сохраняет orders, total и totalToday', (): void => {
      const state: SliceState = runAll(onOpen(), onMessage(socketPayload));

      expect(state.orders).toEqual([order]);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(5);
    });

    it('onError: записывает ошибку и выключает загрузку', (): void => {
      const state: SliceState = runReducer(onError('Соединение потеряно'));

      expect(state.error).toBe('Соединение потеряно');
      expect(state.isLoading).toBe(false);
    });

    it('onClose: сбрасывает isConnected и isLoading, не чистит orders', (): void => {
      const state: SliceState = runAll(onOpen(), onMessage(socketPayload), onClose());

      expect(state.isConnected).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.orders).toEqual([order]);
    });
  });

  describe('activeOrder', () => {
    const withOrders: SliceState = runAll(onOpen(), onMessage(socketPayload));

    it('setActiveOrder: находит заказ по _id', (): void => {
      const state: SliceState = profileOrdersSocketSlice.reducer(
        withOrders,
        setActiveOrder('order-1')
      );

      expect(state.activeOrder).toEqual(order);
    });

    it('setActiveOrder: несуществующий id даёт null', (): void => {
      const state: SliceState = profileOrdersSocketSlice.reducer(
        withOrders,
        setActiveOrder('no-such-id')
      );

      expect(state.activeOrder).toBe(null);
    });

    it('clearActiveOrder: очищает заказ и ошибку', (): void => {
      let state: SliceState = profileOrdersSocketSlice.reducer(
        withOrders,
        setActiveOrder('order-1')
      );
      state = profileOrdersSocketSlice.reducer(state, clearActiveOrder());

      expect(state.activeOrder).toBe(null);
      expect(state.activeOrderError).toBe(null);
    });
  });

  describe('getOrderById', () => {
    it('pending: сбрасывает activeOrder и ошибку', (): void => {
      const state: SliceState = runReducer(getOrderById.pending('1', 'request-1'));

      expect(state.activeOrder).toBe(null);
      expect(state.activeOrderError).toBe(null);
    });

    it('fulfilled: сохраняет заказ', (): void => {
      const state: SliceState = runReducer(
        getOrderById.fulfilled(order, 'request-1', '1')
      );

      expect(state.activeOrder).toEqual(order);
      expect(state.activeOrderError).toBe(null);
    });

    it('rejected: ставит сообщение об ошибке', (): void => {
      const state: SliceState = runReducer(
        getOrderById.rejected(null, 'request-1', '1')
      );

      expect(state.activeOrder).toBe(null);
      expect(state.activeOrderError).toBe('Заказ не найден');
    });
  });

  describe('селекторы', () => {
    const filled: SliceState = runAll(onOpen(), onMessage(socketPayload));
    const rootState: RootState = toRootState(filled);
    const emptyRootState: RootState = toRootState(
      profileOrdersSocketSlice.getInitialState()
    );

    it('profileOrders / profileTotal / profileTotalToday отдают данные', (): void => {
      expect(profileOrders(rootState)).toEqual([order]);
      expect(profileTotal(rootState)).toBe(100);
      expect(profileTotalToday(rootState)).toBe(5);
    });

    it('getIsOrders: true при наличии заказов и false на пустом стейте', (): void => {
      expect(getIsOrders(rootState)).toBe(true);
      expect(getIsOrders(emptyRootState)).toBe(false);
    });

    it('getActiveOrder на пустом стейте — null', (): void => {
      expect(getActiveOrder(emptyRootState)).toBe(null);
    });
  });
});
