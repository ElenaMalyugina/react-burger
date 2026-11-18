// src/services/forgot-password/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  forgotPasswordSlice,
  forgotPasswordResult,
  forgotPasswordLoading,
  forgotPasswordError,
  forgotPasswordRequested,
  resetForgotPasswordState,
} from './slice';
import { forgotPasswordSend, type TForgotPasswordResponse } from './thunks';

const response = { success: true } as TForgotPasswordResponse;
const responseData = {
  email: 'ivan@example.com',
};
const requestId = 'request-1';

type TForgotPasswordResponseState = ReturnType<typeof forgotPasswordSlice.reducer>;
const runReducer = (
  action: Parameters<typeof forgotPasswordSlice.reducer>[1]
): TForgotPasswordResponseState =>
  forgotPasswordSlice.reducer(forgotPasswordSlice.getInitialState(), action);

const runAll = (
  ...actions: Parameters<typeof forgotPasswordSlice.reducer>[1][]
): TForgotPasswordResponseState =>
  actions.reduce(
    (state, action) => forgotPasswordSlice.reducer(state, action),
    forgotPasswordSlice.getInitialState()
  );

describe('forgotPasswordSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(forgotPasswordSlice.getInitialState()).toEqual({
        response: null,
        loading: false,
        error: null,
        resetRequested: false,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = forgotPasswordSlice.reducer(forgotPasswordSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(forgotPasswordSlice.getInitialState());
    });
  });

  describe('resetForgotPasswordState', () => {
    it('сбрасывает resetRequested и response, не трогает loading и error', () => {
      const fulfilledState = runAll(
        forgotPasswordSend.fulfilled(response, requestId, responseData)
      );
      const state = forgotPasswordSlice.reducer(
        fulfilledState,
        resetForgotPasswordState()
      );

      expect(state.resetRequested).toBe(false);
      expect(state.response).toBe(null);
      // проверяем, что остальное не затронуто
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('forgotPasswordSend', () => {
    it('pending: включает loading и сбрасывает ошибку', () => {
      const state = runReducer(forgotPasswordSend.pending('', responseData, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      // не затрагивает флаги запроса и ответ
      expect(state.resetRequested).toBe(false);
      expect(state.response).toBe(null);
    });

    it('fulfilled: сохраняет ответ и ставит resetRequested', () => {
      const state = runReducer(
        forgotPasswordSend.fulfilled(response, requestId, responseData)
      );

      expect(state.loading).toBe(false);
      expect(state.response).toEqual(response);
      expect(state.resetRequested).toBe(true);
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', () => {
      const action = {
        type: forgotPasswordSend.rejected.type,
        payload: '429 Too Many Requests',
        meta: { requestId, arg: responseData },
      } as never;
      const state = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('429 Too Many Requests');
      expect(state.resetRequested).toBe(false);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', () => {
      const action = {
        type: forgotPasswordSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
        meta: { requestId, arg: responseData },
      } as never;
      const state = runReducer(action);

      expect(state.error).toBe('Ошибка восстановления пароля');
    });
  });

  describe('переходы между состояниями', () => {
    it('pending после rejected не теряет resetRequested=false', () => {
      let state = runReducer({
        type: forgotPasswordSend.rejected.type,
        payload: 'ошибка',
      });

      state = forgotPasswordSlice.reducer(
        state,
        forgotPasswordSend.pending('', responseData, requestId)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.resetRequested).toBe(false);
    });

    it('после успешного запроса повторный pending сохраняет response', () => {
      let state = runReducer(
        forgotPasswordSend.fulfilled(response, requestId, responseData)
      );

      state = forgotPasswordSlice.reducer(
        state,
        forgotPasswordSend.pending('', responseData, requestId)
      );
      expect(state.response).toEqual(response);
      expect(state.resetRequested).toBe(true);
    });
  });

  describe('селекторы', () => {
    const filledState = runAll(
      forgotPasswordSend.fulfilled(response, requestId, responseData)
    );
    const rootState = { [forgotPasswordSlice.name]: filledState } as never;
    const initialRootState = {
      [forgotPasswordSlice.name]: forgotPasswordSlice.getInitialState(),
    } as never;

    it('на заполненном состоянии отдают актуальные значения', () => {
      expect(forgotPasswordResult(rootState)).toEqual(response);
      expect(forgotPasswordLoading(rootState)).toBe(false);
      expect(forgotPasswordError(rootState)).toBe(null);
      expect(forgotPasswordRequested(rootState)).toBe(true);
    });

    it('на начальном состоянии отдают безопасные значения', () => {
      expect(forgotPasswordResult(initialRootState)).toBe(null);
      expect(forgotPasswordLoading(initialRootState)).toBe(false);
      expect(forgotPasswordError(initialRootState)).toBe(null);
      expect(forgotPasswordRequested(initialRootState)).toBe(false);
    });
  });
});
