import { getOrderById } from '@/services/feeds-service/slice';
import { useAppSelector } from '@/services/hooks';
import { useNavigate, useParams } from 'react-router-dom';

import { FeedOrderDetails } from '../feed-order-details/feed-order-details';
import Modal from '../modal/modal';

import type { RootState } from '@/services/store';
import type { TOrder } from '@/utils/types';

export const FeedOrderModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order: TOrder | null = useAppSelector((state: RootState) =>
    getOrderById(state, id!)
  );

  const closeModalDetails = (): void => {
    void navigate('/feed', { replace: true });
  };

  return (
    order && (
      <Modal handleCloseModal={closeModalDetails}>
        <FeedOrderDetails order={order} />
      </Modal>
    )
  );
};
