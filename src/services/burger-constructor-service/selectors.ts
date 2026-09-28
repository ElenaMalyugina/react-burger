import { createSelector } from '@reduxjs/toolkit';

import { getBurgerConstructorBun, getBurgerConstructorIngredients } from './slice';

import type { TIngredient } from '@/utils/types';

const getAllIngredients = createSelector(
  [getBurgerConstructorBun, getBurgerConstructorIngredients],
  (bun, ingredients): TIngredient[] => {
    if (!bun) return [...ingredients];

    return [bun, ...ingredients, bun];
  }
);

export const getBurgerConstructorIngredientCount = createSelector(
  [getAllIngredients],
  (ingredients: TIngredient[]) =>
    (ingredientId: string): number =>
      ingredients.reduce((acc, item) => (item._id === ingredientId ? acc + 1 : acc), 0)
);

export const getOrderPrice = createSelector(
  [getAllIngredients],
  (ingredients: TIngredient[]): number =>
    ingredients.reduce((acc, item) => acc + item.price, 0)
);

export const getOrder = createSelector(
  [getAllIngredients],
  (ingredients: TIngredient[]): string[] => ingredients.map((item) => item._id)
);
