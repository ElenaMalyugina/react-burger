import type { TOrder } from '@/utils/types';

import styles from './feed-statuses-block.module.css';

type TFeedStatusesBlock = {
  orders: TOrder[];
  status: TOrder['status'];
};

export const FeedStatusesBlock = ({
  orders,
  status,
}: TFeedStatusesBlock): React.JSX.Element => {
  const COLUMN_SIZE = 10;

  const columns: TOrder[][] = [];

  for (let i = 0; i < orders.length; i += COLUMN_SIZE) {
    columns.push(orders.slice(i, i + COLUMN_SIZE));
  }

  return (
    <div className={`${styles.columnsContainer} ${styles[status]}`}>
      {columns.map((column, colIndex) => (
        <ul
          key={colIndex}
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {column.map((order) => (
            <li
              key={order._id}
              className={`text text_type_main-default ${styles.orderItem}`}
            >
              {order.number ?? '#'}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};
