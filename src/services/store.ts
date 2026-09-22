import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsSlice } from './ingredients-service/slice';
import { selectedIngredientSlice } from './selected-ingredient-service/slice';

const rootReducer = combineSlices(ingredientsSlice, selectedIngredientSlice);

export const store = configureStore({
  reducer: rootReducer,
});

//чтобы ts не ругался
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
