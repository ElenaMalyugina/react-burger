import type { TExtendedIngredient, TIngredient } from './types';

export const ingredientsRowsArrayBuilder = (
  items: (TIngredient | undefined)[]
): TExtendedIngredient[] => {
  const map = new Map<string, TExtendedIngredient>();

  for (const item of items) {
    if (!item) continue;
    if (map.has(item._id)) {
      const ingr = map.get(item._id);

      if (ingr) {
        ingr.count += 1;
      }
    } else {
      map.set(item._id, {
        ...item,
        count: 1,
      });
    }
  }

  return [...map.values()];
};
