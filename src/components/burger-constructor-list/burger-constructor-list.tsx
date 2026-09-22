import { useDrop } from 'react-dnd';

import { BurgerConstructorCard } from '../burger-constructor-card/burger-constructor-card';

import type { TDraggableElement } from '../burger-constructor/burger-constructor';
import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-list.module.css';

type TBurgerConstructorList = {
  ingredients: TIngredient[];
  onDropHandler: (el: TDraggableElement) => void;
};

export const BurgerConstructorList = ({
  ingredients,
  onDropHandler,
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

  const [{ isHover }, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(ingredientCard: TDraggableElement) {
      onDropHandler(ingredientCard);
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

  return (
    <ul
      className={`${styles.burgerConstructorList} ${isHover && styles.isHover}`}
      ref={(node) => {
        dropTarget(node);
      }}
    >
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
