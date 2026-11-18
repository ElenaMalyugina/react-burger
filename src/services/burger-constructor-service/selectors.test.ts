// src/services/burger-constructor/selectors.test.ts
import { describe, it, expect } from 'vitest';

import {
  getBurgerConstructorIngredientCount,
  getOrderPrice,
  getOrder,
} from './selectors';
import { burgerConstructorSlice, addBunBurger, addIngredientToBurger } from './slice';

import type { TIngredient } from '@/utils/types';

const bun = {
  _id: 'bun-1',
  name: 'Краторная булка',
  type: 'bun',
  price: 1255,
} as TIngredient;
const sauce = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 88,
} as TIngredient;
const main = {
  _id: 'main-1',
  name: 'Филе Люминозного минотавра',
  type: 'main',
  price: 1300,
} as TIngredient;

const buildState = (
  ...actions: Parameters<typeof burgerConstructorSlice.reducer>[1][]
): never =>
  ({
    [burgerConstructorSlice.name]: actions.reduce(
      (state, action) => burgerConstructorSlice.reducer(state, action),
      burgerConstructorSlice.getInitialState()
    ),
  }) as never;

describe('селекторы конструктора', () => {
  describe('getOrderPrice', () => {
    it('пустой конструктор — цена 0', () => {
      expect(getOrderPrice(buildState())).toBe(0);
    });

    it('учитывает булку дважды и все ингредиенты', () => {
      const state = buildState(
        addBunBurger(bun),
        addIngredientToBurger(sauce),
        addIngredientToBurger(main)
      );

      // 1255 * 2 + 88 + 1300
      expect(getOrderPrice(state)).toBe(3898);
    });

    it('без булки — только ингредиенты', () => {
      const state = buildState(addIngredientToBurger(sauce));

      expect(getOrderPrice(state)).toBe(88);
    });
  });

  describe('getOrder', () => {
    it('возвращает id: булка, ингредиенты, снова булка', () => {
      const state = buildState(
        addBunBurger(bun),
        addIngredientToBurger(sauce),
        addIngredientToBurger(main)
      );

      expect(getOrder(state)).toEqual(['bun-1', 'sauce-1', 'main-1', 'bun-1']);
    });

    it('пустой конструктор — пустой массив', () => {
      expect(getOrder(buildState())).toEqual([]);
    });
  });

  describe('getBurgerConstructorIngredientCount', () => {
    it('считает вхождения ингредиента по _id, включая булку в начале и в конце', () => {
      const state = buildState(
        addBunBurger(bun),
        addIngredientToBurger(sauce),
        addIngredientToBurger(main),
        addIngredientToBurger(sauce)
      );

      const getCount = getBurgerConstructorIngredientCount(state);

      expect(getCount('bun-1')).toBe(2);
      expect(getCount('sauce-1')).toBe(2);
      expect(getCount('main-1')).toBe(1);
    });

    it('для отсутствующего ингредиента — 0', () => {
      const state = buildState(addIngredientToBurger(sauce));

      expect(getBurgerConstructorIngredientCount(state)('unknown-id')).toBe(0);
    });
  });
});
