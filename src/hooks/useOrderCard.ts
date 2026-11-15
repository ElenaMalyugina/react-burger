import { getIngredientsByIds, getTotalPrice } from '@/services/commonSelectors';
import { useAppSelector } from '@/services/hooks';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

type TUseOrderCard = {
  ingredientsArray: (TIngredient | undefined)[];
  totalPrice: number;
};

export const useOrderCard = (ingredientsIds: string[]): TUseOrderCard => {
  const ingredientsArray = useAppSelector((state: RootState) => {
    return getIngredientsByIds(state, ingredientsIds);
  });

  const totalPrice = useAppSelector((state: RootState) => {
    return getTotalPrice(state, ingredientsIds);
  });

  return {
    ingredientsArray,
    totalPrice,
  };
};
