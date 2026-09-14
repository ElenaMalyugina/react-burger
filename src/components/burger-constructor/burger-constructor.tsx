import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import { BurgerConstructorList } from '../burger-constructor-list/burger-constructor-list';
import { OrderSummaryBlock } from '../order-summary-block/order-summary-block';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  isLoading: boolean;
  isError: boolean;
};

export const BurgerConstructor = ({
  ingredients,
  isLoading,
  isError,
}: TBurgerConstructorProps): React.JSX.Element => {
  return (
    <section className={styles.burger_constructor}>
      {isLoading && <Preloader />}
      {isError && <p>Не удалось получить список ингредиентов</p>}
      <BurgerConstructorList ingredients={ingredients} />
      <OrderSummaryBlock orderIngredients={ingredients} />
    </section>
  );
};
