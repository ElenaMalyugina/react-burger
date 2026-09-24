import {
  addBunBurger,
  addIngredientToBurger,
  getBurgerConstructorBun,
  getBurgerConstructorIngredients,
  reorderBurgerConstructorIngredients,
} from '@/services/burger-constructor-service/slice';
import { useAppDispatch } from '@/services/hooks';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';

import { BurgerConstructorCard } from '../burger-constructor-card/burger-constructor-card';
import { EmptyConstructorCard } from '../empty-constructor-card/empty-constructor-card';

import type { TDraggableElement } from '../burger-constructor/burger-constructor';

import styles from './burger-constructor-list.module.css';

export const BurgerConstructorList = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const bunIngredient = useSelector(getBurgerConstructorBun);
  const otherIngredients = useSelector(getBurgerConstructorIngredients);

  const onDropSortHandler = (dragIndex: number, hoverIndex: number): void => {
    const list = [...otherIngredients];
    const [dragged] = list.splice(dragIndex, 1);
    list.splice(hoverIndex, 0, dragged);
    dispatch(reorderBurgerConstructorIngredients(list));
  };

  const cards = otherIngredients.map((ingredient, ndx) => (
    <BurgerConstructorCard
      key={ingredient.innerId}
      ingredient={ingredient}
      index={ndx}
      onSort={onDropSortHandler}
    />
  ));

  const onDropHandler = (ingredientCard: TDraggableElement): void => {
    const ingredient = ingredientCard.ingredient;

    if (ingredient.type === 'bun') {
      dispatch(addBunBurger(ingredient));
    } else {
      dispatch(addIngredientToBurger(ingredient));
    }
  };

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
      {!bunIngredient && <EmptyConstructorCard text="Выберите булки" type="top" />}
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
        {!cards.length && <EmptyConstructorCard text="Выберите начинку" />}
        {cards}
      </ul>
      {!bunIngredient && <EmptyConstructorCard text="Выберите булки" type="bottom" />}
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
