import { BurgerConstructorCard } from '../burger-constructor-card/burger-constructor-card';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-list.module.css';

type TBurgerConstructorList = {
  ingredients: TIngredient[];
};

export const BurgerConstructorList = ({
  ingredients,
}: TBurgerConstructorList): React.JSX.Element => {
  const cards = ingredients.map((ingredient, ndx) => (
    <BurgerConstructorCard
      key={ingredient._id}
      ingredient={ingredient}
      displayType={
        ndx == 0 ? 'top' : ndx == ingredients.length - 1 ? 'bottom' : undefined
      }
    />
  ));

  return (
    <ul className={`custom-scroll box-with-scroll ${styles.burgerConstructorList}`}>
      {cards}
    </ul>
  );
};
