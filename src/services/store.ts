import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor-service/slice';
import { ingredientsSlice } from './ingredients-service/slice';
import { orderSlice } from './order-service/slice';
import { selectedIngredientSlice } from './selected-ingredient-service/slice';
import { registerSlice } from './register-service/slice';
import { loginSlice } from './login-service/slice';
import { logoutSlice } from './logout-service/slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  selectedIngredientSlice,
  orderSlice,
  burgerConstructorSlice,
  registerSlice,
  loginSlice,
  logoutSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

//чтобы ts не ругался
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
