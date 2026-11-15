import {
  clearActiveOrder,
  getActiveOrder,
  getIsOrders,
} from '@/services/feeds-service/slice';
import { getOrderById } from '@/services/feeds-service/thunks';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { FeedOrderDetails } from '../feed-order-details/feed-order-details';
import Modal from '../modal/modal';

import type { TOrder } from '@/utils/types';

export const FeedOrderModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSocketOrders = useAppSelector(getIsOrders);

  const order: TOrder | null = useAppSelector(getActiveOrder);

  const closeModalDetails = (): void => {
    void navigate('/feed', { replace: true });
    void dispatch(clearActiveOrder());
  };

  useEffect(() => {
    if (id && isSocketOrders) void dispatch(getOrderById(id));
  }, [dispatch, id, isSocketOrders]);

  return (
    order && (
      <Modal handleCloseModal={closeModalDetails}>
        <FeedOrderDetails order={order} />
      </Modal>
    )
  );
};
