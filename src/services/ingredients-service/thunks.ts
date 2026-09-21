import { Urls } from '@/utils/urls';
import { createAsyncThunk } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';

type TIngredientsResponse = {
  data: TIngredient[];
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async () => {
    const res = await fetch(`${Urls.apiUrl}/api/ingredients`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const { data } = (await res.json()) as TIngredientsResponse;

    if (!Array.isArray(data)) {
      throw new Error('Поле data не является массивом');
    }

    return data;
  }
);
