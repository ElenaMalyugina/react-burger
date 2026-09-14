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
        <img src={ingredient.image_large} />
        <h4 className="text text_type_main-medium">{ingredient.name}</h4>
        <table>
          <thead>
            <tr>
              <th>Калории</th>
              <th>Белки</th>
              <th>Жиры</th>
              <th>Углеводы</th>
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
