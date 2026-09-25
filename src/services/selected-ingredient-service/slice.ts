import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type SelectedIngredientState = {
  activeIngredient: TIngredient | null;
};

const initialState: SelectedIngredientState = {
  activeIngredient: null,
};

export const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    selectIngredient: (state, action: { payload: TIngredient }) => {
      state.activeIngredient = action.payload;
    },
    removeSelectedIngredient: (state) => {
      state.activeIngredient = null;
    },
  },
  selectors: {
    selectActiveIngredient: (state) => state.activeIngredient,
  },
});

export const { selectIngredient, removeSelectedIngredient } =
  selectedIngredientSlice.actions;
export const { selectActiveIngredient } = selectedIngredientSlice.selectors;
