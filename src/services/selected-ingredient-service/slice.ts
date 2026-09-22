import { createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type SelectedIngredientState = {
  isModalOpen: boolean;
  activeIngredient: TIngredient | null;
};

const initialState: SelectedIngredientState = {
  isModalOpen: false,
  activeIngredient: null,
};

export const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    selectIngredient: (state, action: { payload: TIngredient }) => {
      state.isModalOpen = true;
      state.activeIngredient = action.payload;
    },
    removeSelectedIngredient: (state) => {
      state.isModalOpen = false;
      state.activeIngredient = null;
    },
  },
  selectors: {
    selectActiveIngredient: (state) => state.activeIngredient,
    selectIsNodfalOpen: (state) => state.isModalOpen,
  },
});

export const { selectIngredient, removeSelectedIngredient } =
  selectedIngredientSlice.actions;
export const { selectActiveIngredient, selectIsNodfalOpen } =
  selectedIngredientSlice.selectors;
