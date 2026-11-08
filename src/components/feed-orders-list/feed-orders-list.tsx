import { FeedOrderCard } from '../feed-order-card/feed-order-card';

import type { TOrder } from '@/utils/types';

import styles from './feed-orders-list.module.css';

type TFeedOrderListProps = {
  orders: TOrder[];
};

export const FeedOrdersList = ({ orders }: TFeedOrderListProps): React.JSX.Element => {
  const orderCards = orders.map((order) => (
    <FeedOrderCard key={order._id} order={order} />
  ));

  return <ul className={styles.feedOrdersList}>{orderCards}</ul>;
};
