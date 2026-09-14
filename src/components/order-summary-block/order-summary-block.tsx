import { useModal } from '@/hooks/useModal';
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
  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const newSummaryPrice = orderIngredients.reduce(
      (acc, ingredient) => (acc = acc + ingredient.price),
      0
    );
    setTotalCost(newSummaryPrice);
  }, [orderIngredients]);

  const createOrder = (): void => {
    console.log('Заказ создан');
    openModal();
  };

  const pauseOrder = (): void => {
    closeModal();
  };

  return (
    <>
      <section className="ml-5 mr-5 mb-5 mt-5">
        <div className={styles.orderSummaryFlex}>
          <PriceBlock price={totalCost} textClass={'text text_type_main-large'} />
          <Button onClick={createOrder} size="medium" type="primary" htmlType={'button'}>
            Оформить заказ
          </Button>
        </div>
      </section>
      {isModalOpen && (
        <Modal handleCloseModal={pauseOrder}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
