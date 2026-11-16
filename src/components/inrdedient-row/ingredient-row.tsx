import { PriceBlock } from '../price-block/price-block';

import type { TExtendedIngredient } from '@/utils/types';

import styles from './ingredient-row.module.css';

type TIngredientRow = {
  ingredient: TExtendedIngredient;
};

export const IngredientRow = ({ ingredient }: TIngredientRow): React.JSX.Element => {
  return (
    <tr className={`text text_type_main-default mb-2`}>
      <td>
        <div className={styles.ingredientImgWrapper}>
          <img
            className={styles.ingredientImg}
            src={ingredient.image_mobile}
            alt={ingredient.name}
          />
        </div>
      </td>
      <td>
        <span>{ingredient.name}</span>
      </td>
      <td style={{ textAlign: 'right' }}>
        <span
          style={{ display: 'flex', whiteSpace: 'nowrap', justifyContent: 'flex-end' }}
        >
          {ingredient.count}
          &times;
          <PriceBlock price={ingredient.price} textClass={styles.price} />
        </span>
      </td>
    </tr>
  );
};
