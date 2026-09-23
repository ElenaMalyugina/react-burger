import { deleteIngredient } from '@/services/burger-constructor-service/slice';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDispatch } from 'react-redux';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-card.module.css';

type TBurgerConstructorCard = {
  ingredient: TIngredient;
  displayType?: 'top' | 'bottom' | undefined;
  postfix?: string;
};

export const BurgerConstructorCard = ({
  ingredient,
  displayType,
  postfix,
}: TBurgerConstructorCard): React.JSX.Element => {
  const dispatch = useDispatch();

  const handleDelete = (ingredient: TIngredient): void => {
    dispatch(deleteIngredient(ingredient));
  };

  return (
    <li className={styles.burgerConstructorCard}>
      {displayType == undefined && (
        <button className={styles.dragButton}>
          <DragIcon type="primary" />
        </button>
      )}
      <ConstructorElement
        handleClose={() => {
          handleDelete(ingredient);
        }}
        isLocked={displayType !== undefined}
        price={ingredient.price}
        text={`${ingredient.name} ${postfix ?? postfix}`}
        thumbnail={ingredient.image}
        type={displayType}
      />
    </li>
  );
};
