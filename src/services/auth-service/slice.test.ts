import { describe, it, expect } from 'vitest';

import { loginSend } from '../login-service/thunks';
import { logoutSend } from '../logout-service/thunks';
import { authSlice, authResult, isAuthResult, authLoading, authError } from './slice';
import { authSend } from './thunks';

const user = { name: 'Иван', email: 'ivan@example.com' };

type TAuthState = ReturnType<typeof authSlice.reducer>;

const runReducer = (action: Parameters<typeof authSlice.reducer>[1]): TAuthState =>
  authSlice.reducer(authSlice.getInitialState(), action);

describe('initial state', () => {
  it('initialState имеет корректные значения по умолчанию', () => {
    expect(authSlice.getInitialState()).toEqual({
      authUserData: null,
      isAuthChecked: false,
      loading: false,
      error: null,
    });
  });

  it('редьюсер с неизвестным экшеном не меняет начальное состояние', () => {
    const state = authSlice.reducer(authSlice.getInitialState(), {
      type: 'UNKNOWN_ACTION',
    });

    expect(state).toEqual(authSlice.getInitialState());
  });
});

describe('authSlice', () => {
  describe('authSend', () => {
    it('pending: включает loading и сбрасывает ошибку', () => {
      const state = runReducer(authSend.pending('', null));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      // isAuthChecked и пользователь не трогаем
      expect(state.isAuthChecked).toBe(false);
      expect(state.authUserData).toBe(null);
    });

    it('fulfilled: сохраняет пользователя и помечает авторизацию проверенной', () => {
      const state = runReducer(authSend.fulfilled({ user, success: true }, '', null));

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.authUserData).toEqual(user);
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', () => {
      const action = {
        type: authSend.rejected.type,
        payload: '401 Unauthorized',
      } as never;
      const state = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.authUserData).toBe(null);
      expect(state.error).toBe('401 Unauthorized');
    });

    it('rejected без payload: подставляет сообщение по умолчанию', () => {
      const action = {
        type: authSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
      } as never;
      const state = runReducer(action);

      expect(state.error).toBe('Ошибка обновления профиля');
    });
  });

  describe('matchers на экшены', () => {
    it('loginSend.fulfilled: перезаписывает пользователя', () => {
      const action = { type: loginSend.fulfilled.type, payload: { user } };
      const state = runReducer(action);

      expect(state.authUserData).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(null);
    });

    it('logoutSend.fulfilled: очищает пользователя', () => {
      // сначала «логинимся», потом «логаутимся»
      let state = runReducer({
        type: loginSend.fulfilled.type,
        payload: { user },
      });

      state = authSlice.reducer(state, {
        type: logoutSend.fulfilled.type,
      });

      expect(state.authUserData).toBe(null);
      expect(state.isAuthChecked).toBe(true);
    });

    it('не реагирует на loginSend.pending', () => {
      const state = runReducer({ type: loginSend.pending.type });

      expect(state).toEqual(authSlice.getInitialState());
    });
  });

  describe('selectors', () => {
    const baseState = {
      ...authSlice.getInitialState(),
      authUserData: user,
      isAuthChecked: true,
      loading: false,
      error: null,
    };

    it('authResult возвращает пользователя', () => {
      expect(authResult({ [authSlice.name]: baseState })).toEqual(user);
    });

    it('isAuthResult возвращает флаг проверки', () => {
      expect(isAuthResult({ [authSlice.name]: baseState })).toBe(true);
    });

    it('authLoading и authError отдают безопасные значения по умолчанию', () => {
      const initial = { [authSlice.name]: authSlice.getInitialState() } as never;

      expect(authLoading(initial)).toBe(false);
      expect(authError(initial)).toBe(null);
    });
  });
});
