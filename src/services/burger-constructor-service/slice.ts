import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { TIngredient } from '@/utils/types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBunBurger: (state, action: { payload: TIngredient }) => {
      state.bun = action.payload;
    },
    addIngredientToBurger: (state, action: { payload: TIngredient }) => {
      const ingredient = { ...action.payload };
      ingredient.innerId = nanoid();
      state.ingredients.push(ingredient);
    },
    deleteIngredient: (state, action: { payload: TIngredient }) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.innerId != action.payload.innerId
      );
    },
    reorderBurgerConstructorIngredients: (state, action: { payload: TIngredient[] }) => {
      state.ingredients = action.payload;
    },
  },
  selectors: {
    getBurgerConstructorBun: (state) => state.bun,
    getBurgerConstructorIngredients: (state) => state.ingredients,
    getAllIngredients: (state) =>
      [state.bun, ...state.ingredients, state.bun].filter((item) => item !== null),
  },
});

export const { getBurgerConstructorBun, getBurgerConstructorIngredients } =
  burgerConstructorSlice.selectors;

export const {
  addBunBurger,
  addIngredientToBurger,
  deleteIngredient,
  reorderBurgerConstructorIngredients,
} = burgerConstructorSlice.actions;

export const getBurgerConstructorIngredientCount = createSelector(
  [
    (state: RootState): TIngredient[] =>
      burgerConstructorSlice.getSelectors().getAllIngredients(state.burgerConstructor),
    (_state: RootState, ingredientId: string): string => ingredientId,
  ],
  (ingredients, ingredientId): number =>
    ingredients.reduce((acc, item) => (item._id === ingredientId ? acc + 1 : acc), 0)
);

export const getOrderPrice = createSelector(
  [
    (state: RootState): TIngredient[] =>
      burgerConstructorSlice.getSelectors().getAllIngredients(state.burgerConstructor),
  ],
  (ingredients): number => ingredients.reduce((acc, item) => acc + item.price, 0)
);
