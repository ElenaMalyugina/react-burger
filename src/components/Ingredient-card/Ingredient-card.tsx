import { Counter } from '@krgaa/react-developer-burger-ui-components';

import { PriceBlock } from '../price-block/price-block';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
};

export const IngredientCard = ({
  ingredient,
}: TIngredientCardProps): React.JSX.Element => {
  return (
    <li className={styles.ingredientCard} tabIndex={0}>
      <Counter count={1} size="default" />
      <img src={ingredient.image} alt={ingredient.name} />
      <PriceBlock price={ingredient.price} />
      <h3>{ingredient.name}</h3>
    </li>
  );
};
