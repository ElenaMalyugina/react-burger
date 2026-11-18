// src/services/edit-profile/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  editProfileSlice,
  editProfileResult,
  editProfileLoading,
  editProfileError,
  editProfileIsUpdated,
} from './slice';
import {
  editProfileSend,
  type TEditProfileResponse,
  type TProfileDataState,
} from './thunks';

const response = {
  success: true,
  user: { name: 'Иван', email: 'ivan@example.com' },
} as TEditProfileResponse;

const profileData: TProfileDataState = {
  name: 'Иван',
  email: 'ivan@example.com',
  password: 'secret',
};

type TEditProfileResponseState = ReturnType<typeof editProfileSlice.reducer>;

const requestId = 'test-request-id';
const runReducer = (
  action: Parameters<typeof editProfileSlice.reducer>[1]
): TEditProfileResponseState =>
  editProfileSlice.reducer(editProfileSlice.getInitialState(), action);

describe('editProfileSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(editProfileSlice.getInitialState()).toEqual({
        response: null,
        loading: false,
        isUpdated: false,
        error: null,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = editProfileSlice.reducer(editProfileSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(editProfileSlice.getInitialState());
    });
  });

  describe('editProfileSend', () => {
    it('pending: включает loading, сбрасывает ошибку и флаг обновления', () => {
      const state = runReducer(editProfileSend.pending('', profileData, requestId));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.isUpdated).toBe(false);
      expect(state.response).toBe(null);
    });

    it('fulfilled: сохраняет ответ и ставит isUpdated', () => {
      const state = runReducer(
        editProfileSend.fulfilled(response, '', profileData, undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.response).toEqual(response);
      expect(state.isUpdated).toBe(true);
      expect(state.error).toBe(null);
    });

    it('rejected: сохраняет ошибку из payload', () => {
      const action = {
        type: editProfileSend.rejected.type,
        payload: '403 Forbidden',
      } as never;
      const state = runReducer(action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('403 Forbidden');
      expect(state.isUpdated).toBe(false);
      expect(state.response).toBe(null);
    });

    it('rejected без payload: подставляет сообщение по умолчанию', () => {
      const action = {
        type: editProfileSend.rejected.type,
        payload: undefined,
        error: { message: 'net down' },
      } as never;
      const state = runReducer(action);

      expect(state.error).toBe('Ошибка обновления профиля');
    });
  });

  describe('селекторы', () => {
    const baseState = {
      ...editProfileSlice.getInitialState(),
      response,
      loading: true,
      isUpdated: true,
      error: 'some error',
    };

    const rootState = { [editProfileSlice.name]: baseState } as never;
    const initialRootState = {
      [editProfileSlice.name]: editProfileSlice.getInitialState(),
    } as never;

    it('editProfileResult возвращает ответ', () => {
      expect(editProfileResult(rootState)).toEqual(response);
    });

    it('editProfileLoading возвращает флаг загрузки', () => {
      expect(editProfileLoading(rootState)).toBe(true);
    });

    it('editProfileError возвращает ошибку', () => {
      expect(editProfileError(rootState)).toBe('some error');
    });

    it('editProfileIsUpdated возвращает флаг обновления', () => {
      expect(editProfileIsUpdated(rootState)).toBe(true);
    });

    it('на начальном состоянии селекторы отдают безопасные значения', () => {
      expect(editProfileResult(initialRootState)).toBe(null);
      expect(editProfileLoading(initialRootState)).toBe(false);
      expect(editProfileError(initialRootState)).toBe(null);
      expect(editProfileIsUpdated(initialRootState)).toBe(false);
    });
  });

  describe('переходы между состояниями', () => {
    it('pending после fulfilled сбрасывает isUpdated и ответ не трогает', () => {
      let state = editProfileSlice.reducer(
        editProfileSlice.getInitialState(),
        editProfileSend.fulfilled(response, '', profileData, undefined)
      );

      state = editProfileSlice.reducer(
        state,
        editProfileSend.pending('', profileData, undefined)
      );

      expect(state.isUpdated).toBe(false);
      expect(state.response).toEqual(response);
    });
  });
});
