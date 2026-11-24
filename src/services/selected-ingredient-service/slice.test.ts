// src/services/selected-ingredient/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  selectedIngredientSlice,
  selectIngredient,
  removeSelectedIngredient,
  selectActiveIngredient,
} from './slice';

import type { TIngredient } from '@/utils/types';

// ---------- типы ----------

type SliceState = ReturnType<typeof selectedIngredientSlice.reducer>;
type SliceAction = Parameters<typeof selectedIngredientSlice.reducer>[1];
type RootState = { [selectedIngredientSlice.name]: SliceState };

// ---------- фикстуры ----------

const ingredient: TIngredient = {
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
  __v: 0,
};

const secondIngredient: TIngredient = {
  ...ingredient,
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 88,
};

// ---------- помощники ----------

const runReducer = (action: SliceAction): SliceState =>
  selectedIngredientSlice.reducer(selectedIngredientSlice.getInitialState(), action);

const toRootState = (sliceState: SliceState): RootState => ({
  [selectedIngredientSlice.name]: sliceState,
});

// ---------- тесты ----------

describe('selectedIngredientSlice', () => {
  describe('начальное состояние', () => {
    it('initialState содержит значения по умолчанию', (): void => {
      expect(selectedIngredientSlice.getInitialState()).toEqual({
        activeIngredient: null,
      });
    });

    it('неизвестный экшен не меняет состояние', (): void => {
      const state: SliceState = runReducer({ type: 'UNKNOWN_ACTION' });

      expect(state).toEqual(selectedIngredientSlice.getInitialState());
    });
  });

  describe('selectIngredient', () => {
    it('сохраняет переданный ингредиент', (): void => {
      const state: SliceState = runReducer(selectIngredient(ingredient));

      expect(state.activeIngredient).toEqual(ingredient);
    });

    it('перезаписывает ранее выбранный ингредиент', (): void => {
      let state: SliceState = runReducer(selectIngredient(ingredient));
      state = selectedIngredientSlice.reducer(state, selectIngredient(secondIngredient));

      expect(state.activeIngredient).toEqual(secondIngredient);
    });
  });

  describe('removeSelectedIngredient', () => {
    it('очищает выбранный ингредиент', (): void => {
      let state: SliceState = runReducer(selectIngredient(ingredient));
      state = selectedIngredientSlice.reducer(state, removeSelectedIngredient());

      expect(state.activeIngredient).toBe(null);
    });

    it('не падает, если ингредиент и так не выбран', (): void => {
      const state: SliceState = runReducer(removeSelectedIngredient());

      expect(state.activeIngredient).toBe(null);
    });
  });

  describe('селектор selectActiveIngredient', () => {
    it('на заполненном состоянии отдаёт выбранный ингредиент', (): void => {
      const filled: SliceState = runReducer(selectIngredient(ingredient));

      expect(selectActiveIngredient(toRootState(filled))).toEqual(ingredient);
    });

    it('на начальном состоянии отдаёт null', (): void => {
      expect(
        selectActiveIngredient(toRootState(selectedIngredientSlice.getInitialState()))
      ).toBe(null);
    });
  });
});
