import type { TIngredient } from '@/utils/types';

import styles from './feed-ingredient-item.module.css';

type TIngredientItemProps = {
  ingredient: TIngredient;
};

export const FeedIngredientItem = ({
  ingredient,
}: TIngredientItemProps): React.JSX.Element => {
  return (
    <li className={styles.ingredientItem}>
      <img
        className={styles.ingredientIcon}
        src={ingredient?.image_mobile}
        alt={ingredient?.name}
        title={ingredient?.name}
      />
    </li>
  );
};
