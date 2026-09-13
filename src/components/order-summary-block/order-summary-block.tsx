import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { PriceBlock } from '../price-block/price-block';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './order-summary-block.module.css';

type TOrderSummaryBlock = {
  orderIngredients: TIngredient[];
};

export const OrderSummaryBlock = ({
  orderIngredients,
}: TOrderSummaryBlock): React.JSX.Element => {
  const [summaryPrice, setSummaryPrice] = useState(0);

  useEffect(() => {
    const newSummaryPrice = orderIngredients.reduce(
      (acc, ingredient) => (acc = acc + ingredient.price),
      0
    );
    setSummaryPrice(newSummaryPrice);
  }, [orderIngredients]);

  const createOrder = (): void => {
    console.log('Заказ создан');
  };

  return (
    <section className={styles.orderSummaryBlock}>
      <div className={styles.orderSummaryFlex}>
        <PriceBlock price={summaryPrice} textClass={'text text_type_main-large'} />
        <Button onClick={createOrder} size="medium" type="primary" htmlType={'button'}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
