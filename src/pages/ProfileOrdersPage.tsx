import { ProfileOrdersList } from '@/components/profile-orders-list/profile-orders-list';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import {
  connect,
  disconnect,
  profileOrders,
} from '@/services/profie-orders-service/slice';
import { useEffect } from 'react';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(profileOrders) ?? [];

  useEffect((): (() => void) => {
    void dispatch(fetchIngredients());

    void dispatch(connect());

    return () => {
      void dispatch(disconnect());
    };
  }, [dispatch]);

  return (
    <main className="p-5 pt-10">
      <div className="container">
        <ProfileOrdersList orders={orders} />
      </div>
    </main>
  );
};
