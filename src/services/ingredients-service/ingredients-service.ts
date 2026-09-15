import { Urls } from '@/utils/urls';

import type { TIngredient } from '@/utils/types';

type IngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const ingredientsService = {
  getIngredients: (): Promise<TIngredient[]> => {
    return fetch(`${Urls.apiUrl}/api/ingredients`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json() as Promise<IngredientsResponse>;
      })
      .then((data) => {
        return data.data;
      });
  },
};
