import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
};

export const IngredientCard = ({
  ingredient,
}: TIngredientCardProps): React.JSX.Element => {
  return (
    <li className={styles.ingredientCard}>
      <Counter count={1} size="default" />
      <img src={ingredient.image} alt={ingredient.name} />
      <p>
        {ingredient.price} <CurrencyIcon type="primary" />
      </p>
      <h3>{ingredient.name}</h3>
    </li>
  );
};
