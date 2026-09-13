import { BurgerConstructorCard } from '../burger-constructor-card/burger-constructor-card';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-list.module.css';

type TBurgerConstructorList = {
  ingredients: TIngredient[];
};

export const BurgerConstructorList = ({
  ingredients,
}: TBurgerConstructorList): React.JSX.Element => {
  const ingredientsForCards = [...ingredients];

  const firstIngredient = ingredientsForCards.shift();
  const latestIngredient = ingredientsForCards.pop();

  const cards = ingredientsForCards.map((ingredient) => (
    <BurgerConstructorCard key={ingredient._id} ingredient={ingredient} />
  ));

  return (
    <ul className={styles.burgerConstructorList}>
      {firstIngredient && (
        <BurgerConstructorCard
          key={firstIngredient._id}
          ingredient={firstIngredient}
          displayType="top"
        />
      )}
      <ul
        className={`custom-scroll box-with-scroll ${styles.burgerConstructorListInner}`}
      >
        {cards}
      </ul>
      {latestIngredient && (
        <BurgerConstructorCard
          key={latestIngredient._id}
          ingredient={latestIngredient}
          displayType="bottom"
        />
      )}
    </ul>
  );
};
