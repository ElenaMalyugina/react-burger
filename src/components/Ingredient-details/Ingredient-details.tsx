import type { TIngredient } from '@/utils/types';

type TIngredientDetails = {
  ingredient: TIngredient | null;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetails): React.JSX.Element | null => {
  return (
    ingredient && (
      <div>
        {ingredient.image_large}
        {ingredient.name}
      </div>
    )
  );
};
