import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  clearActiveOrder,
  getActiveOrder,
} from '@/services/profie-orders-service/slice';
import { getOrderById } from '@/services/profie-orders-service/thunks';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '../modal/modal';
import { ProfileOrderDetails } from '../profile-order-details/profile-order-details';

import type { TOrder } from '@/utils/types';

export const ProfileOrderModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const order: TOrder | null = useAppSelector(getActiveOrder);

  const closeModalDetails = (): void => {
    void navigate('/profile/orders', { replace: true });
    void dispatch(clearActiveOrder());
  };

  useEffect(() => {
    if (id) void dispatch(getOrderById(id));
  }, [dispatch]);

  return (
    order && (
      <Modal handleCloseModal={closeModalDetails}>
        <ProfileOrderDetails order={order} />
      </Modal>
    )
  );
};
