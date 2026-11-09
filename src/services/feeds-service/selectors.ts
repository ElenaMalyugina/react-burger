import { createSelector } from '@reduxjs/toolkit';

import { getIngredients } from '../ingredients-service/slice';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

export const getIngredientsByIds = createSelector(
  [
    (_: RootState, ingredientsIds: string[]): string[] => ingredientsIds,
    (state: RootState): TIngredient[] => getIngredients(state),
  ],
  (
    ingredientsIds: string[],
    ingredients: TIngredient[]
  ): (TIngredient | undefined)[] => {
    return ingredientsIds.map((ingrId: string): TIngredient | undefined =>
      ingredients.find((el: TIngredient): boolean => el._id == ingrId)
    );
  }
);

export const getTotalPrice = createSelector(
  [getIngredientsByIds],
  (ingredients: (TIngredient | undefined)[]): number =>
    ingredients.reduce((acc: number, item: TIngredient | undefined): number => {
      acc = acc + (item?.price ?? 0);
      return acc;
    }, 0)
);
