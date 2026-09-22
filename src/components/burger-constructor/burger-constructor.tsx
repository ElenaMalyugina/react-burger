import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';

import { BurgerConstructorList } from '../burger-constructor-list/burger-constructor-list';
import { OrderSummaryBlock } from '../order-summary-block/order-summary-block';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export type TDraggableElement = {
  ingredient: TIngredient;
};

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  isLoading: boolean;
  isError: boolean;
  onDropHandler: (ingredient: TDraggableElement) => void;
};

export const BurgerConstructor = ({
  ingredients,
  isLoading,
  isError,
  onDropHandler,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(ingredientCard: TDraggableElement) {
      onDropHandler(ingredientCard);
    },
  });

  return (
    <section
      className={`pb-4 ${styles.burger_constructor}`}
      ref={(node) => {
        dropTarget(node);
      }}
    >
      {isLoading && <Preloader />}
      {isError && (
        <p className="text text_type_main-small mt-2 mb-2">
          Не удалось получить список ингредиентов
        </p>
      )}
      <BurgerConstructorList ingredients={ingredients} />
      <OrderSummaryBlock orderIngredients={ingredients} />
    </section>
  );
};
