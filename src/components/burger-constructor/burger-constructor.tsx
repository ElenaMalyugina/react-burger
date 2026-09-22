import { BurgerConstructorList } from '../burger-constructor-list/burger-constructor-list';
import { OrderSummaryBlock } from '../order-summary-block/order-summary-block';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export type TDraggableElement = {
  ingredient: TIngredient;
};

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onDropHandler: (el: TDraggableElement) => void;
};

export const BurgerConstructor = ({
  ingredients,
  onDropHandler,
}: TBurgerConstructorProps): React.JSX.Element => {
  return (
    <section className={`pb-4 ${styles.burger_constructor}`}>
      <BurgerConstructorList ingredients={ingredients} onDropHandler={onDropHandler} />
      <OrderSummaryBlock orderIngredients={ingredients} />
    </section>
  );
};
