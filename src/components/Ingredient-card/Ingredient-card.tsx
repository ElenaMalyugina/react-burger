import { getBurgerConstructorIngredientCount } from '@/services/burger-constructor-service/selectors';
import { Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { PriceBlock } from '../price-block/price-block';

import type { RootState } from '@/services/store';
import type { TIngredient } from '@/utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
  handleClick: () => void;
};

export const IngredientCard = ({
  ingredient,
  handleClick,
}: TIngredientCardProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: () => ({ ingredient }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const ingredientCount = useSelector((state: RootState) =>
    getBurgerConstructorIngredientCount(state)(ingredient._id)
  );

  return (
    <li
      ref={(node) => {
        dragRef(node);
      }} // правильный тип для ref
      className={`p-2 ${styles.ingredientCard} ${isDragging ? 'opacity-90' : ''}`}
      onClick={handleClick}
      tabIndex={0}
    >
      <Counter count={ingredientCount} size="default" />
      <img src={ingredient.image} alt={ingredient.name} />
      <PriceBlock price={ingredient.price} textClass="text text_type_main-medium" />
      <h3>{ingredient.name}</h3>
    </li>
  );
};
