import { request } from '@/utils/checkResponse';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const res = (await request('/api/ingredients')) as TIngredientsResponse;

      if (!Array.isArray(res.data)) {
        throw new Error('Поле data не является массивом');
      }
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка при загрузке ингредиентов'
      );
    }
  }
);
