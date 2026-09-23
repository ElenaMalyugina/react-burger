import { BurgerConstructorList } from '../burger-constructor-list/burger-constructor-list';
import { OrderSummaryBlock } from '../order-summary-block/order-summary-block';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export type TDraggableElement = {
  ingredient: TIngredient;
};

export const BurgerConstructor = (): React.JSX.Element => {
  return (
    <section className={`pb-4 ${styles.burger_constructor}`}>
      <BurgerConstructorList />
      <OrderSummaryBlock />
    </section>
  );
};
