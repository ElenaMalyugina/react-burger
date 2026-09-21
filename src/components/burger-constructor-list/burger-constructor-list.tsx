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

  const bunIngredient = ingredientsForCards.find(
    (ingredient) => ingredient.type === 'bun'
  );

  const otherIngredients = ingredientsForCards.filter(
    (ingredient) => ingredient.type !== 'bun'
  );

  const cards = otherIngredients.map((ingredient) => (
    <BurgerConstructorCard key={ingredient._id} ingredient={ingredient} />
  ));

  return (
    <ul className={styles.burgerConstructorList}>
      {bunIngredient && (
        <BurgerConstructorCard
          key={bunIngredient._id}
          ingredient={bunIngredient}
          displayType="top"
          postfix="Верх"
        />
      )}
      <ul
        className={`custom-scroll box-with-scroll ${styles.burgerConstructorListInner}`}
      >
        {cards}
      </ul>
      {bunIngredient && (
        <BurgerConstructorCard
          key={`${bunIngredient._id}-l`}
          ingredient={bunIngredient}
          displayType="bottom"
          postfix="Низ"
        />
      )}
    </ul>
  );
};
