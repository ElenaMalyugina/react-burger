import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

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
    addBunBurger: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredientToBurger: {
      reducer: (state, action: PayloadAction<TIngredient>) => {
        const ingredient = { ...action.payload };
        state.ingredients.push(ingredient);
      },
      prepare: (ingredient: TIngredient) => {
        return { payload: { ...ingredient, innerId: nanoid() } };
      },
    },
    deleteIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.innerId != action.payload.innerId
      );
    },
    reorderBurgerConstructorIngredients: (
      state,
      action: PayloadAction<TIngredient[]>
    ) => {
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
