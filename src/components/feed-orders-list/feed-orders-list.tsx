import { isOrderValid } from '@/utils/checkValidOrder';

import { FeedOrderCard } from '../feed-order-card/feed-order-card';

import type { TOrder } from '@/utils/types';

import styles from './feed-orders-list.module.css';

type TFeedOrderListProps = {
  orders: TOrder[];
};

export const FeedOrdersList = ({ orders }: TFeedOrderListProps): React.JSX.Element => {
  const orderCards = orders.map((order) => {
    if (!isOrderValid) return;

    return <FeedOrderCard key={order._id} order={order} />;
  });

  return <ul className={styles.feedOrdersList}>{orderCards}</ul>;
};
