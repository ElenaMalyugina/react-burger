// src/services/logout/slice.test.ts
import { describe, it, expect } from 'vitest';

import { logoutSlice, logoutResult, logoutLoading, logoutError } from './slice';
import { logoutSend } from './thunks';

const requestId = 'request-1';

const response = {
  success: true,
  message: 'Выход выполнен',
} as never; // TForgotPassword-like: { success: boolean; message: string }

type TLogoutResponseState = ReturnType<typeof logoutSlice.reducer>;

const runReducer = (
  action: Parameters<typeof logoutSlice.reducer>[1]
): TLogoutResponseState => logoutSlice.reducer(logoutSlice.getInitialState(), action);

const runAll = (
  ...actions: Parameters<typeof logoutSlice.reducer>[1][]
): TLogoutResponseState =>
  actions.reduce(
    (state, action) => logoutSlice.reducer(state, action),
    logoutSlice.getInitialState()
  );

describe('logoutSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(logoutSlice.getInitialState()).toEqual({
        response: null,
        loading: false,
        error: null,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = logoutSlice.reducer(logoutSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(logoutSlice.getInitialState());
    });
  });

  describe('logoutSend', () => {
    it('pending: включает loading и сбрасывает ошибку', () => {
      const state = runReducer(logoutSend.pending('', undefined, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.response).toBe(null);
    });

    it('fulfilled: сохраняет message из ответа', () => {
      const state = runReducer(logoutSend.fulfilled(response, requestId, undefined));

      expect(state.loading).toBe(false);
      expect(state.response).toBe('Выход выполнен');
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', () => {
      const action = {
        type: logoutSend.rejected.type,
        payload: '401 Требуется авторизация',
        meta: { requestId },
      } as never;
      const state = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('401 Требуется авторизация');
      expect(state.response).toBe(null);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', () => {
      const action = {
        type: logoutSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
        meta: { requestId },
      } as never;
      const state = runReducer(action);

      expect(state.error).toBe('Не удалось выйти');
    });
  });

  describe('переходы между состояниями', () => {
    it('после ошибки повторный pending чистит ошибку', () => {
      const rejected = {
        type: logoutSend.rejected.type,
        payload: 'Ошибка сети',
      } as never;

      let state = runReducer(rejected);
      state = logoutSlice.reducer(state, logoutSend.pending('', undefined, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('селекторы', () => {
    const filledRootState = {
      [logoutSlice.name]: runAll(logoutSend.fulfilled(response, requestId, undefined)),
    } as never;
    const initialRootState = {
      [logoutSlice.name]: logoutSlice.getInitialState(),
    } as never;

    it('на заполненном состоянии отдают актуальные значения', () => {
      expect(logoutResult(filledRootState)).toBe('Выход выполнен');
      expect(logoutLoading(filledRootState)).toBe(false);
      expect(logoutError(filledRootState)).toBe(null);
    });

    it('на начальном состоянии отдают безопасные значения', () => {
      expect(logoutResult(initialRootState)).toBe(null);
      expect(logoutLoading(initialRootState)).toBe(false);
      expect(logoutError(initialRootState)).toBe(null);
    });
  });
});
