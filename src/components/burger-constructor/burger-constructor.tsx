import { BurgerConstructorList } from '../burger-constructor-list/burger-constructor-list';
import { OrderSummaryBlock } from '../order-summary-block/order-summary-block';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  return (
    <section className={styles.burger_constructor}>
      <BurgerConstructorList ingredients={ingredients} />
      <OrderSummaryBlock orderIngredients={ingredients} />
    </section>
  );
};
