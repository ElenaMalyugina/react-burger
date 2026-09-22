import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsSlice } from './ingredients-service/slice';
import { orderSlice } from './order-service/slice';
import { selectedIngredientSlice } from './selected-ingredient-service/slice';

const rootReducer = combineSlices(ingredientsSlice, selectedIngredientSlice, orderSlice);

export const store = configureStore({
  reducer: rootReducer,
});

//чтобы ts не ругался
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
