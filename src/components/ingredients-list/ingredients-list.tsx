import { IngredientCard } from '../Ingredient-card/Ingredient-card';

import type { TIngredient } from '@/utils/types';

import styles from './ingredients-list.module.css';

type TIngredientsListProps = {
  ingredients: TIngredient[];
  ingredientsType: string;
};

export const IngredientsList = ({
  ingredients,
  ingredientsType,
}: TIngredientsListProps): React.JSX.Element => {
  const IngredientsCards = ingredients.map((item) => (
    <IngredientCard key={item._id} ingredient={item} />
  ));

  return (
    <section className={`box-with-scroll`}>
      <h2>{ingredientsType}</h2>
      <ul className={`custom-scroll ${styles['ingredients-list']}`}>
        {IngredientsCards}
      </ul>
    </section>
  );
};
