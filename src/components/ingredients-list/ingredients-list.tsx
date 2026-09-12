import { IngredientCard } from '../Ingredient-card/Ingredient-card';

import type { TIngredient } from '@/utils/types';

import styles from './ingredients-list.module.css';

type TIngredientsListProps = {
  ingredients: TIngredient[];
};

export const IngredientsList = ({
  ingredients,
}: TIngredientsListProps): React.JSX.Element => {
  const IngredientsCards = ingredients.map((item) => (
    <IngredientCard key={item._id} ingredient={item} />
  ));

  return (
    <ul className={`custom-scroll box-with-scroll ${styles['ingredients-list']}`}>
      {IngredientsCards}
    </ul>
  );
};
