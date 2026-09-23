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

const getAllIngredients = createSelector(
  [
    (state: RootState): TIngredient | null => state.burgerConstructor.bun,
    (state: RootState): TIngredient[] => state.burgerConstructor.ingredients,
  ],
  (bun, ingredients): TIngredient[] =>
    [bun, ...ingredients, bun].filter((item) => item !== null)
);

export const getBurgerConstructorIngredientCount = createSelector(
  [getAllIngredients, (_state: RootState, ingredientId: string): string => ingredientId],
  (ingredients, ingredientId): number =>
    ingredients.reduce((acc, item) => (item._id === ingredientId ? acc + 1 : acc), 0)
);

export const getOrderPrice = createSelector([getAllIngredients], (ingredients): number =>
  ingredients.reduce((acc, item) => acc + item.price, 0)
);

export const getOrder = createSelector([getAllIngredients], (ingredients): string[] =>
  ingredients.map((item) => item._id)
);
