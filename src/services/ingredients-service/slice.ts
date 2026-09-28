import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './thunks';

import type { TIngredient } from '@/utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: boolean;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: false,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngredientsError: (state) => state.error,
    getIngredientsLoading: (state) => state.loading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const { getIngredients, getIngredientsLoading, getIngredientsError } =
  ingredientsSlice.selectors;
