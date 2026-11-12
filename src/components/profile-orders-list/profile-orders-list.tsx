import { ProfileOrderCard } from '../profile-order-card/profile-order-card';

import type { TOrder } from '@/utils/types';

import styles from './profile-orders-list.module.css';

type TProfileOrderListProps = {
  orders: TOrder[];
};

export const ProfileOrdersList = ({
  orders,
}: TProfileOrderListProps): React.JSX.Element => {
  const orderCards = orders.map((order) => (
    <ProfileOrderCard key={order._id} order={order} />
  ));

  return <ul className={styles.profieOrdersList}>{orderCards}</ul>;
};
