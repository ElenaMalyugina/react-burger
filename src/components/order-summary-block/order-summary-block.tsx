import { useModal } from '@/hooks/useModal';
import { getOrderPrice } from '@/services/burger-constructor-service/slice';
import { useAppDispatch } from '@/services/hooks';
import { createOrder } from '@/services/order-service/slice';
import { sendOrder } from '@/services/order-service/thunks';
import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import Modal from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { PriceBlock } from '../price-block/price-block';

import type React from 'react';

import styles from './order-summary-block.module.css';

const testData = [
  '692889f16bf770001bfeb4cc',
  '692889f16bf770001bfeb4d6',
  '692889f16bf770001bfeb4cc',
];

export const OrderSummaryBlock = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const { isModalOpen, openModal, closeModal } = useModal();

  const orderId = useSelector(createOrder);

  const totalCost = useSelector(getOrderPrice);

  const createOrderHandler = (): void => {
    void dispatch(sendOrder(testData));
    console.log('Заказ создан');
    openModal();
  };

  const pauseOrderHandler = (): void => {
    closeModal();
  };

  return (
    <>
      <section className="ml-5 mr-5 mb-5 mt-5">
        <div className={styles.orderSummaryFlex}>
          <PriceBlock price={totalCost} textClass={'text text_type_main-large'} />
          <Button
            onClick={createOrderHandler}
            size="medium"
            type="primary"
            htmlType={'button'}
          >
            Оформить заказ
          </Button>
        </div>
      </section>
      {isModalOpen && (
        <Modal handleCloseModal={pauseOrderHandler}>
          <OrderDetails orderId={orderId} />
        </Modal>
      )}
    </>
  );
};
