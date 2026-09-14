import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import Modal from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
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
  const [totalCost, setTotalCost] = useState(0);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const newSummaryPrice = orderIngredients.reduce(
      (acc, ingredient) => (acc = acc + ingredient.price),
      0
    );
    setTotalCost(newSummaryPrice);
  }, [orderIngredients]);

  const createOrder = (): void => {
    console.log('Заказ создан');
    setShowOrderDetails(true);
  };

  const pauseOrder = (): void => {
    setShowOrderDetails(false);
  };

  return (
    <>
      <section className={styles.orderSummaryBlock}>
        <div className={styles.orderSummaryFlex}>
          <PriceBlock price={totalCost} textClass={'text text_type_main-large'} />
          <Button onClick={createOrder} size="medium" type="primary" htmlType={'button'}>
            Оформить заказ
          </Button>
        </div>
      </section>
      {showOrderDetails && (
        <Modal handleCloseModal={pauseOrder}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
