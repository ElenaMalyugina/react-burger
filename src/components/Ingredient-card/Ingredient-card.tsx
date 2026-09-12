import { Counter } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

type TIngredientCardProps = {
  ingredient: TIngredient;
};

export const IngredientCard = ({
  ingredient,
}: TIngredientCardProps): React.JSX.Element => {
  return (
    <li>
      <Counter count={1} size="default" />
      {ingredient.name}
    </li>
  );
};
