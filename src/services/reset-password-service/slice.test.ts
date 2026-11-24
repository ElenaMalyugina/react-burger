// src/services/reset-password/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  resetPasswordSlice,
  resetPasswordResult,
  resetPasswordLoading,
  resetPasswordError,
} from './slice';
import { resetPasswordSend, type TResetPasswordResponse } from './thunks';

// ---------- типы ----------

type SliceState = ReturnType<typeof resetPasswordSlice.reducer>;
type SliceAction = Parameters<typeof resetPasswordSlice.reducer>[1];
type RootState = { [resetPasswordSlice.name]: SliceState };

// ---------- фикстуры ----------

const resetData = {
  password: 'new-secret',
  token: 'reset-token-123',
};

const response: TResetPasswordResponse = {
  success: true,
} as TResetPasswordResponse;

const requestId = 'request-1';

// ---------- помощники ----------

const runReducer = (action: SliceAction): SliceState =>
  resetPasswordSlice.reducer(resetPasswordSlice.getInitialState(), action);

const runAll = (...actions: SliceAction[]): SliceState =>
  actions.reduce<SliceState>(
    (state, action) => resetPasswordSlice.reducer(state, action),
    resetPasswordSlice.getInitialState()
  );

const toRootState = (sliceState: SliceState): RootState => ({
  [resetPasswordSlice.name]: sliceState,
});

// ---------- тесты ----------

describe('resetPasswordSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', (): void => {
      expect(resetPasswordSlice.getInitialState()).toEqual({
        response: null,
        loading: false,
        error: null,
      });
    });

    it('неизвестный экшен не меняет состояние', (): void => {
      const state: SliceState = runReducer({ type: 'UNKNOWN_ACTION' });

      expect(state).toEqual(resetPasswordSlice.getInitialState());
    });
  });

  describe('resetPasswordSend', () => {
    it('pending: включает loading и сбрасывает ошибку', (): void => {
      const state: SliceState = runReducer(
        resetPasswordSend.pending('', resetData, requestId)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.response).toBe(null);
    });

    it('fulfilled: сохраняет ответ', (): void => {
      const state: SliceState = runReducer(
        resetPasswordSend.fulfilled(response, requestId, resetData)
      );

      expect(state.loading).toBe(false);
      expect(state.response).toEqual(response);
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', (): void => {
      const action = {
        type: resetPasswordSend.rejected.type,
        payload: 'Токен недействителен или устарел',
        meta: { requestId, arg: resetData },
      } as never;
      const state: SliceState = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Токен недействителен или устарел');
      expect(state.response).toBe(null);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', (): void => {
      const action = {
        type: resetPasswordSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
        meta: { requestId, arg: resetData },
      } as never;
      const state: SliceState = runReducer(action);

      expect(state.error).toBe('Ошибка восстановления пароля');
    });
  });

  describe('переходы между состояниями', () => {
    it('после ошибки повторный pending чистит ошибку', (): void => {
      const rejected = {
        type: resetPasswordSend.rejected.type,
        payload: 'Неверный токен',
      } as never;

      let state: SliceState = runReducer(rejected);
      expect(state.error).toBe('Неверный токен');

      state = resetPasswordSlice.reducer(
        state,
        resetPasswordSend.pending('', resetData, requestId)
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('селекторы', () => {
    const filledRootState: RootState = toRootState(
      runAll(resetPasswordSend.fulfilled(response, requestId, resetData))
    );
    const initialRootState: RootState = toRootState(
      resetPasswordSlice.getInitialState()
    );

    it('на заполненном состоянии отдают актуальные значения', (): void => {
      expect(resetPasswordResult(filledRootState)).toEqual(response);
      expect(resetPasswordLoading(filledRootState)).toBe(false);
      expect(resetPasswordError(filledRootState)).toBe(null);
    });

    it('на начальном состоянии отдают безопасные значения', (): void => {
      expect(resetPasswordResult(initialRootState)).toBe(null);
      expect(resetPasswordLoading(initialRootState)).toBe(false);
      expect(resetPasswordError(initialRootState)).toBe(null);
    });
  });
});
