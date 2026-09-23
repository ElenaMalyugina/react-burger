import { createSlice } from '@reduxjs/toolkit';

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
      state.ingredients.push(action.payload);
    },
  },
  selectors: {
    getBurgerConstructorBun: (state) => state.bun,
    getBurgerConstructorIngredients: (state) => state.ingredients,
  },
});

export const { getBurgerConstructorBun, getBurgerConstructorIngredients } =
  burgerConstructorSlice.selectors;

export const { addBunBurger, addIngredientToBurger } = burgerConstructorSlice.actions;
