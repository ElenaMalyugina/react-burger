import { clearActiveOrder, getActiveOrder } from '@/services/feeds-service/slice';
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

  const order: TOrder | null = useAppSelector(getActiveOrder);

  const closeModalDetails = (): void => {
    void navigate('/feed', { replace: true });
    void dispatch(clearActiveOrder());
  };

  useEffect(() => {
    if (id) void dispatch(getOrderById(id));
  }, [dispatch, id]);

  return (
    order && (
      <Modal handleCloseModal={closeModalDetails}>
        <FeedOrderDetails order={order} />
      </Modal>
    )
  );
};
