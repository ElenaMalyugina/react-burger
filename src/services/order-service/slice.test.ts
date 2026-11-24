// src/services/order/slice.test.ts
import { describe, it, expect } from 'vitest';

import { orderSlice, createOrder, createOrderLoading, createOrderError } from './slice';
import { sendOrder } from './thunks';

const requestId = 'request-1';
const orderNum = 12345;

// аргумент thunk-а — обычно массив id ингредиентов; поправьте под фактический тип
const orderPayload = ['bun-1', 'sauce-1', 'main-1'];

type TCreateOrderState = ReturnType<typeof orderSlice.reducer>;

const runReducer = (
  action: Parameters<typeof orderSlice.reducer>[1]
): TCreateOrderState => orderSlice.reducer(orderSlice.getInitialState(), action);

const runAll = (
  ...actions: Parameters<typeof orderSlice.reducer>[1][]
): TCreateOrderState =>
  actions.reduce(
    (state, action) => orderSlice.reducer(state, action),
    orderSlice.getInitialState()
  );

describe('orderSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(orderSlice.getInitialState()).toEqual({
        orderNum: null,
        loading: false,
        error: null,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = orderSlice.reducer(orderSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(orderSlice.getInitialState());
    });
  });

  describe('sendOrder', () => {
    it('pending: включает loading, чистит ошибку и старый номер заказа', () => {
      const state = runReducer(sendOrder.pending('', orderPayload, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.orderNum).toBe(null);
    });

    it('fulfilled: сохраняет номер заказа', () => {
      const state = runReducer(sendOrder.fulfilled(orderNum, requestId, orderPayload));

      expect(state.loading).toBe(false);
      expect(state.orderNum).toBe(12345);
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload и сбрасывает номер', () => {
      const action = {
        type: sendOrder.rejected.type,
        payload: '403 Требуется авторизация',
        meta: { requestId, arg: orderPayload },
      } as never;
      const state = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('403 Требуется авторизация');
      expect(state.orderNum).toBe(null);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', () => {
      const action = {
        type: sendOrder.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
        meta: { requestId, arg: orderPayload },
      } as never;
      const state = runReducer(action);

      expect(state.error).toBe('Не удалось создать заказ');
    });
  });

  describe('переходы между состояниями', () => {
    it('pending после fulfilled сбрасывает старый номер заказа', () => {
      let state = runReducer(sendOrder.fulfilled(orderNum, requestId, orderPayload));
      expect(state.orderNum).toBe(12345);

      state = orderSlice.reducer(state, sendOrder.pending('', orderPayload, requestId));

      expect(state.orderNum).toBe(null);
      expect(state.loading).toBe(true);
    });

    it('rejected после fulfilled сбрасывает номер и показывает ошибку', () => {
      let state = runReducer(sendOrder.fulfilled(orderNum, requestId, orderPayload));

      const rejected = {
        type: sendOrder.rejected.type,
        payload: 'Ошибка',
      } as never;
      state = orderSlice.reducer(state, rejected);

      expect(state.orderNum).toBe(null);
      expect(state.error).toBe('Ошибка');
    });

    it('после ошибки повторный pending чистит ошибку', () => {
      const rejected = { type: sendOrder.rejected.type, payload: 'Ошибка' } as never;

      let state = runReducer(rejected);
      state = orderSlice.reducer(state, sendOrder.pending('', orderPayload, requestId));

      expect(state.error).toBe(null);
      expect(state.loading).toBe(true);
    });
  });

  describe('селекторы', () => {
    const filledRootState = {
      [orderSlice.name]: runAll(sendOrder.fulfilled(orderNum, requestId, orderPayload)),
    } as never;
    const initialRootState = {
      [orderSlice.name]: orderSlice.getInitialState(),
    } as never;

    it('на заполненном состоянии отдают актуальные значения', () => {
      expect(createOrder(filledRootState)).toBe(12345);
      expect(createOrderLoading(filledRootState)).toBe(false);
      expect(createOrderError(filledRootState)).toBe(null);
    });

    it('на начальном состоянии отдают безопасные значения', () => {
      expect(createOrder(initialRootState)).toBe(null);
      expect(createOrderLoading(initialRootState)).toBe(false);
      expect(createOrderError(initialRootState)).toBe(null);
    });
  });
});
