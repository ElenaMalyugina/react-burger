// src/services/register/slice.test.ts
import { describe, it, expect } from 'vitest';

import { registerSlice, registerResult, registerLoading, registerError } from './slice';
import { registerSend, type TRegisterResponse } from './thunks';

// ---------- типы ----------

type SliceState = ReturnType<typeof registerSlice.reducer>;
type SliceAction = Parameters<typeof registerSlice.reducer>[1];
type RootState = { [registerSlice.name]: SliceState };

// ---------- фикстуры ----------

const registerData = {
  name: 'Иван',
  email: 'ivan@example.com',
  password: 'secret',
};

const response: TRegisterResponse = {
  success: true,
  user: { name: 'Иван', email: 'ivan@example.com' },
} as TRegisterResponse;

const requestId = 'request-1';

// ---------- помощники ----------

const runReducer = (action: SliceAction): SliceState =>
  registerSlice.reducer(registerSlice.getInitialState(), action);

const runAll = (...actions: SliceAction[]): SliceState =>
  actions.reduce<SliceState>(
    (state, action) => registerSlice.reducer(state, action),
    registerSlice.getInitialState()
  );

const toRootState = (sliceState: SliceState): RootState => ({
  [registerSlice.name]: sliceState,
});

// ---------- тесты ----------

describe('registerSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', (): void => {
      expect(registerSlice.getInitialState()).toEqual({
        response: null,
        loading: false,
        error: null,
      });
    });

    it('неизвестный экшен не меняет состояние', (): void => {
      const state: SliceState = runReducer({ type: 'UNKNOWN_ACTION' });

      expect(state).toEqual(registerSlice.getInitialState());
    });
  });

  describe('registerSend', () => {
    it('pending: включает loading и сбрасывает ошибку', (): void => {
      const state: SliceState = runReducer(
        registerSend.pending('', registerData, requestId)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.response).toBe(null);
    });

    it('fulfilled: сохраняет ответ пользователя', (): void => {
      const state: SliceState = runReducer(
        registerSend.fulfilled(response, requestId, registerData)
      );

      expect(state.loading).toBe(false);
      expect(state.response).toEqual(response);
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', (): void => {
      const action = {
        type: registerSend.rejected.type,
        payload: 'Пользователь с таким email уже существует',
        meta: { requestId, arg: registerData },
      } as never;
      const state: SliceState = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Пользователь с таким email уже существует');
      expect(state.response).toBe(null);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', (): void => {
      const action = {
        type: registerSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
        meta: { requestId, arg: registerData },
      } as never;
      const state: SliceState = runReducer(action);

      expect(state.error).toBe('Не удалось зарегистрироваться');
    });
  });

  describe('переходы между состояниями', () => {
    it('после ошибки повторный pending чистит ошибку', (): void => {
      const rejected = {
        type: registerSend.rejected.type,
        payload: 'Email занят',
      } as never;

      let state: SliceState = runReducer(rejected);
      expect(state.error).toBe('Email занят');

      state = registerSlice.reducer(
        state,
        registerSend.pending('', registerData, requestId)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('селекторы', () => {
    const filledRootState: RootState = toRootState(
      runAll(registerSend.fulfilled(response, requestId, registerData))
    );
    const initialRootState: RootState = toRootState(registerSlice.getInitialState());

    it('на заполненном состоянии отдают актуальные значения', (): void => {
      expect(registerResult(filledRootState)).toEqual(response);
      expect(registerLoading(filledRootState)).toBe(false);
      expect(registerError(filledRootState)).toBe(null);
    });

    it('на начальном состоянии отдают безопасные значения', (): void => {
      expect(registerResult(initialRootState)).toBe(null);
      expect(registerLoading(initialRootState)).toBe(false);
      expect(registerError(initialRootState)).toBe(null);
    });
  });
});
