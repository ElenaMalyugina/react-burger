// src/services/burger-constructor/slice.test.ts
import { describe, it, expect } from 'vitest';

import {
  burgerConstructorSlice,
  getBurgerConstructorBun,
  getBurgerConstructorIngredients,
  addBunBurger,
  addIngredientToBurger,
  deleteIngredient,
  reorderBurgerConstructorIngredients,
  deleteAll,
} from './slice';

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

type TAction = Parameters<typeof burgerConstructorSlice.reducer>[1];

type TBurgerConstructorState = ReturnType<typeof burgerConstructorSlice.reducer>;

const run = (...actions: TAction[]): TBurgerConstructorState =>
  actions.reduce(
    (state, action) => burgerConstructorSlice.reducer(state, action),
    burgerConstructorSlice.getInitialState()
  );

describe('burgerConstructorSlice', () => {
  describe('начальное состояние', () => {
    it('initialState пустой: булка null, ингредиентов нет', () => {
      expect(burgerConstructorSlice.getInitialState()).toEqual({
        bun: null,
        ingredients: [],
      });
    });

    it('неизвестный экшен не меняет состояние', () => {
      const state = burgerConstructorSlice.reducer(
        burgerConstructorSlice.getInitialState(),
        { type: 'UNKNOWN_ACTION' }
      );

      expect(state).toEqual(burgerConstructorSlice.getInitialState());
    });
  });

  describe('addBunBurger', () => {
    it('добавляет булку в состояние', () => {
      const state = run(addBunBurger(bun));

      expect(state.bun).toEqual(bun);
      expect(state.ingredients).toEqual([]);
    });

    it('заменяет предыдущую булку', () => {
      const anotherBun = { ...bun, _id: 'bun-2', name: 'Флюоресцентная булка' };
      const state = run(addBunBurger(bun), addBunBurger(anotherBun));

      expect(state.bun).toEqual(anotherBun);
    });
  });

  describe('addIngredientToBurger', () => {
    it('добавляет ингредиент в конец списка', () => {
      const state = run(addIngredientToBurger(sauce), addIngredientToBurger(main));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe(sauce.name);
      expect(state.ingredients[1].name).toBe(main.name);
    });

    it('prepare добавляет уникальный innerId', () => {
      const action = addIngredientToBurger(sauce);

      expect(action.payload.innerId).toBeTruthy();
      expect(action.payload.innerId).not.toBe(sauce.innerId);
    });

    it('два добавления одного ингредиента дают разные innerId', () => {
      const state = run(addIngredientToBurger(sauce), addIngredientToBurger(sauce));

      const [first, second] = state.ingredients;
      expect(first.innerId).not.toBe(second.innerId);
    });

    it('не добавляет булку в ingredients', () => {
      const state = run(addBunBurger(bun));

      expect(state.ingredients).toEqual([]);
    });
  });

  describe('deleteIngredient', () => {
    it('удаляет ингредиент по innerId', () => {
      const sauceAction = addIngredientToBurger(sauce);
      const mainAction = addIngredientToBurger(main);

      const state = run(sauceAction, mainAction, deleteIngredient(sauceAction.payload));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(main.name);
    });

    it('не трогает ингредиенты с другим innerId', () => {
      const state = run(
        addIngredientToBurger(sauce),
        deleteIngredient({ ...sauce, innerId: 'несуществующий-id' })
      );

      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('reorderBurgerConstructorIngredients', () => {
    it('заменяет список ингредиентов переданным массивом', () => {
      const state = run(
        addIngredientToBurger(sauce),
        addIngredientToBurger(main),
        reorderBurgerConstructorIngredients([main, sauce])
      );

      expect(state.ingredients.map((i) => i.name)).toEqual([main.name, sauce.name]);
    });
  });

  describe('deleteAll', () => {
    it('обнуляет состав бургера', () => {
      const state = run(addBunBurger(bun), addIngredientToBurger(sauce), deleteAll());

      expect(state.bun).toBe(null);
      expect(state.ingredients).toEqual([]);
    });
  });

  describe('selectors', () => {
    it('getBurgerConstructorBun возвращает булку', () => {
      const rootState = {
        [burgerConstructorSlice.name]: { bun, ingredients: [] },
      };

      expect(getBurgerConstructorBun(rootState as never)).toEqual(bun);
    });

    it('getBurgerConstructorIngredients возвращает список ингредиентов', () => {
      const action = addIngredientToBurger(sauce);
      const rootState = {
        [burgerConstructorSlice.name]: run(action),
      };

      expect(getBurgerConstructorIngredients(rootState as never)).toEqual([
        action.payload,
      ]);
    });
  });
});
