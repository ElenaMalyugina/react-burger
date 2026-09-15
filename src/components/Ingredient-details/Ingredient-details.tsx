import type { TIngredient } from '@/utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetails = {
  ingredient: TIngredient | null;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetails): React.JSX.Element | null => {
  return (
    ingredient && (
      <div>
        <img src={ingredient.image_large} />
        <h4 className="text text_type_main-medium mb-3">{ingredient.name}</h4>
        <table
          className={`text text_type_main-small text_color_inactive ${styles.table}`}
        >
          <thead>
            <tr>
              <th>Калории, ккал</th>
              <th>Белки, г</th>
              <th>Жиры, г</th>
              <th>Углеводы, г</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{ingredient.calories}</td>
              <td>{ingredient.proteins}</td>
              <td>{ingredient.fat}</td>
              <td>{ingredient.carbohydrates}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  );
};
