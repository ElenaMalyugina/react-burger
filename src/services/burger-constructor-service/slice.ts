import { createSlice, nanoid } from '@reduxjs/toolkit';

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
    addIngredientToBurger: {
      reducer: (state, action: { payload: TIngredient }) => {
        const ingredient = { ...action.payload };
        state.ingredients.push(ingredient);
      },
      prepare: (ingredient: TIngredient) => {
        return { payload: { ...ingredient, innerId: nanoid() } };
      },
    },
    deleteIngredient: (state, action: { payload: TIngredient }) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.innerId != action.payload.innerId
      );
    },
    reorderBurgerConstructorIngredients: (state, action: { payload: TIngredient[] }) => {
      state.ingredients = action.payload;
    },
    deleteAll: (state) => {
      state.bun = null;
      state.ingredients = [];
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
  deleteAll,
} = burgerConstructorSlice.actions;
