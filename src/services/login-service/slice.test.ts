// src/services/login/slice.test.ts
import { describe, it, expect } from 'vitest';

import { loginSlice, loginResult, loginLoading, loginError } from './slice';
import { loginSend, type TLoginResponse } from './thunks';

const credentials = { email: 'ivan@example.com', password: 'secret' };
const response = {
  success: true,
  user: { name: 'Иван', email: 'ivan@example.com' },
} as TLoginResponse;
const requestId = 'request-1';

type TLoginResponseDataState = ReturnType<typeof loginSlice.reducer>;

const runReducer = (
  action: Parameters<typeof loginSlice.reducer>[1]
): TLoginResponseDataState => loginSlice.reducer(loginSlice.getInitialState(), action);

const runAll = (
  ...actions: Parameters<typeof loginSlice.reducer>[1][]
): TLoginResponseDataState =>
  actions.reduce(
    (state, action) => loginSlice.reducer(state, action),
    loginSlice.getInitialState()
  );

describe('loginSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(loginSlice.getInitialState()).toEqual({
        response: null,
        loading: false,
        error: null,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = loginSlice.reducer(loginSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(loginSlice.getInitialState());
    });
  });

  describe('loginSend', () => {
    it('pending: включает loading и сбрасывает ошибку', () => {
      const state = runReducer(loginSend.pending('', credentials, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.response).toBe(null);
    });

    it('fulfilled: сохраняет ответ и выключает loading', () => {
      const state = runReducer(loginSend.fulfilled(response, requestId, credentials));

      expect(state.loading).toBe(false);
      expect(state.response).toEqual(response);
      // fulfilled не чистит error напрямую — он уже null после pending
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', () => {
      const action = {
        type: loginSend.rejected.type,
        payload: '401 Неверный пароль',
        meta: { requestId, arg: credentials },
      } as never;
      const state = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('401 Неверный пароль');
      expect(state.response).toBe(null);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', () => {
      const action = {
        type: loginSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
        meta: { requestId, arg: credentials },
      } as never;
      const state = runReducer(action);

      expect(state.error).toBe('Не удалось войти');
    });
  });

  describe('переходы между состояниями', () => {
    it('после неудачного входа повторный pending чистит ошибку', () => {
      const rejected = {
        type: loginSend.rejected.type,
        payload: '401 Неверный пароль',
      } as never;

      let state = runReducer(rejected);
      expect(state.error).toBe('401 Неверный пароль');

      state = loginSlice.reducer(state, loginSend.pending('', credentials, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('rejected после fulfilled не трогает response', () => {
      let state = runReducer(loginSend.fulfilled(response, requestId, credentials));

      const rejected = { type: loginSend.rejected.type, payload: 'ошибка' } as never;
      state = loginSlice.reducer(state, rejected);

      expect(state.response).toEqual(response);
      expect(state.error).toBe('ошибка');
    });
  });

  describe('селекторы', () => {
    const filledRootState = {
      [loginSlice.name]: runAll(loginSend.fulfilled(response, requestId, credentials)),
    } as never;
    const initialRootState = {
      [loginSlice.name]: loginSlice.getInitialState(),
    } as never;

    it('на заполненном состоянии отдают актуальные значения', () => {
      expect(loginResult(filledRootState)).toEqual(response);
      expect(loginLoading(filledRootState)).toBe(false);
      expect(loginError(filledRootState)).toBe(null);
    });

    it('на начальном состоянии отдают безопасные значения', () => {
      expect(loginResult(initialRootState)).toBe(null);
      expect(loginLoading(initialRootState)).toBe(false);
      expect(loginError(initialRootState)).toBe(null);
    });
  });
});
