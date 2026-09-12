import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-card.module.css';

type TBurgerConstructorCard = {
  ingredient: TIngredient;
  displayType: 'top' | 'bottom' | undefined;
};

export const BurgerConstructorCard = ({
  ingredient,
  displayType,
}: TBurgerConstructorCard): React.JSX.Element => {
  return (
    <li className={styles.burgerConstructorCard}>
      <ConstructorElement
        handleClose={() => {
          return false;
        }}
        isLocked={displayType !== undefined}
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
        type={displayType}
      />
    </li>
  );
};
