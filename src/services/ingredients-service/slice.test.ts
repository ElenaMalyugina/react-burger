// src/services/ingredients/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  ingredientsSlice,
  getIngredients,
  getIngredientsLoading,
  getIngredientsError,
  getIngredientById,
} from './slice';
import { fetchIngredients } from './thunks';

import type { TIngredient } from '@/utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_mobile: '',
  image_large: '',
} as TIngredient;

const sauce: TIngredient = {
  ...bun,
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 88,
};

type TIngredientsState = ReturnType<typeof ingredientsSlice.reducer>;

const runReducer = (
  action: Parameters<typeof ingredientsSlice.reducer>[1]
): TIngredientsState =>
  ingredientsSlice.reducer(ingredientsSlice.getInitialState(), action);

const runAll = (
  ...actions: Parameters<typeof ingredientsSlice.reducer>[1][]
): TIngredientsState =>
  actions.reduce(
    (state, action) => ingredientsSlice.reducer(state, action),
    ingredientsSlice.getInitialState()
  );

describe('ingredientsSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', () => {
      expect(ingredientsSlice.getInitialState()).toEqual({
        ingredients: [],
        loading: false,
        error: false,
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = ingredientsSlice.reducer(ingredientsSlice.getInitialState(), {
        type: 'UNKNOWN_ACTION',
      });

      expect(state).toEqual(ingredientsSlice.getInitialState());
    });
  });

  describe('fetchIngredients', () => {
    it('pending: включает loading и сбрасывает ошибку', () => {
      const state = runReducer(fetchIngredients.pending('request-1', undefined));

      expect(state.loading).toBe(true);
      expect(state.error).toBe(false);
      expect(state.ingredients).toEqual([]);
    });

    it('fulfilled: сохраняет список и выключает loading и ошибку', () => {
      const state = runReducer(
        fetchIngredients.fulfilled([bun, sauce], 'request-1', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(false);
      expect(state.ingredients).toEqual([bun, sauce]);
    });

    it('rejected: ставит error, список не трогает', () => {
      const state = runReducer(
        fetchIngredients.rejected(new Error('net down'), 'request-1', undefined)
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(true);
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('переходы между состояниями', () => {
    it('pending после rejected снова чистит error', () => {
      let state = runReducer(
        fetchIngredients.rejected(new Error('net down'), 'request-1', undefined)
      );

      state = ingredientsSlice.reducer(
        state,
        fetchIngredients.pending('request-2', undefined)
      );

      expect(state.error).toBe(false);
      expect(state.loading).toBe(true);
    });
  });

  describe('селекторы', () => {
    const filled = runAll(
      fetchIngredients.fulfilled([bun, sauce], 'request-1', undefined)
    );
    const rootState = { [ingredientsSlice.name]: filled } as never;
    const emptyRootState = {
      [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
    } as never;

    it('getIngredients возвращает список', () => {
      expect(getIngredients(rootState)).toEqual([bun, sauce]);
    });

    it('getIngredientsLoading и getIngredientsError отдают флаги', () => {
      expect(getIngredientsLoading(emptyRootState)).toBe(false);
      expect(getIngredientsError(emptyRootState)).toBe(false);

      const rejectedState = {
        [ingredientsSlice.name]: runReducer(
          fetchIngredients.rejected(new Error('fail'), 'request-1', undefined)
        ),
      } as never;

      expect(getIngredientsError(rejectedState)).toBe(true);
    });

    it('getIngredientById находит ингредиент по _id', () => {
      expect(getIngredientById(rootState, 'sauce-1')).toEqual(sauce);
    });

    it('getIngredientById для неизвестного id — null', () => {
      expect(getIngredientById(rootState, 'unknown')).toBe(null);
    });
  });
});
