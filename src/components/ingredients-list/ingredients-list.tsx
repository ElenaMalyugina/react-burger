import { IngredientCard } from '../Ingredient-card/Ingredient-card';

import type { TIngredient } from '@/utils/types';

type TIngredientsListProps = {
  ingredients: TIngredient[];
};

export const IngredientsList = ({
  ingredients,
}: TIngredientsListProps): React.JSX.Element => {
  const IngredientsCards = ingredients.map((item) => (
    <IngredientCard key={item._id} ingredient={item} />
  ));

  return <ul>{IngredientsCards}</ul>;
};
