// src/services/constructor/selectors.test.ts
import { describe, it, expect } from 'vitest';

import { getIngredientsByIds, getTotalPrice } from './commonSelectors';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

// ---------- типы ----------

// ----------
// Составной стейт: селекторам нужен и slice ingredients, и сам RootState
// ----------

type TestRootState = RootState & { ingredients: { ingredients: TIngredient[] } };

// ---------- фикстуры ----------

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
  __v: 0,
};

const sauce: TIngredient = {
  ...bun,
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 88,
};

const main: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  price: 1333,
};

const stateWith = (ingredients: TIngredient[]): TestRootState =>
  ({ ingredients: { ingredients } }) as TestRootState;

// ---------- тесты ----------

describe('getIngredientsByIds', () => {
  it('возвращает ингредиенты в порядке переданных id', (): void => {
    const state: TestRootState = stateWith([bun, sauce, main]);

    const result = getIngredientsByIds(state, ['sauce-1', 'bun-1']);

    expect(result).toEqual([sauce, bun]);
  });

  it('сохраняет дубликаты: один и тот же id повторяется столько раз, сколько передан', (): void => {
    const state: TestRootState = stateWith([bun, sauce]);

    const result = getIngredientsByIds(state, ['bun-1', 'sauce-1', 'bun-1']);

    expect(result).toEqual([bun, sauce, bun]);
  });

  it('для несуществующего id оставляет undefined (дырка)', (): void => {
    const state: TestRootState = stateWith([bun]);

    const result = getIngredientsByIds(state, ['bun-1', 'no-such-id']);

    expect(result[0]).toEqual(bun);
    expect(result[1]).toBe(undefined);
    expect(result).toHaveLength(2);
  });

  it('на пустом списке ингредиентов весь результат — дырки', (): void => {
    const state: TestRootState = stateWith([]);

    const result = getIngredientsByIds(state, ['bun-1', 'sauce-1']);

    expect(result).toEqual([undefined, undefined]);
  });

  it('на пустом списке id возвращает пустой массив', (): void => {
    const state: TestRootState = stateWith([bun, sauce]);

    const result = getIngredientsByIds(state, []);

    expect(result).toEqual([]);
  });

  it('не зависит от порядка в списке ингредиентов', (): void => {
    const state: TestRootState = stateWith([main, sauce, bun]);

    const result = getIngredientsByIds(state, ['bun-1', 'main-1']);

    expect(result).toEqual([bun, main]);
  });
});

describe('getTotalPrice', () => {
  it('суммирует цены всех ингредиентов по id', (): void => {
    const state: TestRootState = stateWith([bun, sauce, main]);

    expect(getTotalPrice(state, ['bun-1', 'sauce-1', 'main-1'])).toBe(
      bun.price + sauce.price + main.price
    );
  });

  it('учитывает дубликаты: булка считается за каждый слой', (): void => {
    const state: TestRootState = stateWith([bun, sauce]);

    // верх и низ бургера — одна и та же булка
    expect(getTotalPrice(state, ['bun-1', 'sauce-1', 'bun-1'])).toBe(
      bun.price * 2 + sauce.price
    );
  });

  it('дырки в списке считаются как 0, остальная сумма сохраняется', (): void => {
    const state: TestRootState = stateWith([bun, sauce]);

    expect(getTotalPrice(state, ['bun-1', 'no-such-id', 'sauce-1'])).toBe(
      bun.price + sauce.price
    );
  });

  it('все ингредиенты потеряны — итог 0', (): void => {
    const state: TestRootState = stateWith([]);

    expect(getTotalPrice(state, ['bun-1', 'sauce-1'])).toBe(0);
  });

  it('пустой конструктор — 0', (): void => {
    const state: TestRootState = stateWith([bun, sauce]);

    expect(getTotalPrice(state, [])).toBe(0);
  });

  it('работает от пустого состояния без ингредиентов', (): void => {
    const state: TestRootState = stateWith([]);

    expect(getTotalPrice(state, ['bun-1'])).toBe(0);
  });
});
