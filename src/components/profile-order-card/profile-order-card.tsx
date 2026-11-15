import { useOrderCard } from '@/hooks/useOrderCard';
import { formatRelativeDate } from '@/utils/data-formatter';
import { statusesFormatter } from '@/utils/statuses-formatter';
import { Link } from 'react-router-dom';

import { FeedIngredientItem } from '../feed-ingredient-item/feed-ingredient-item';
import { PriceBlock } from '../price-block/price-block';

import type { TOrder } from '@/utils/types';

import styles from '../styles/order-card.module.css';

type TProfileOrderCardProps = {
  order: TOrder;
};

export const ProfileOrderCard = ({
  order,
}: TProfileOrderCardProps): React.JSX.Element => {
  const ingredientsArray = useOrderCard(order.ingredients).ingredientsArray;

  const ingredientsArrayBuns =
    ingredientsArray.filter((ingr) => ingr?.type === 'bun') ?? [];

  const totalPrice = useOrderCard(order.ingredients).totalPrice;

  return (
    <li className={styles.orderCard} key={order._id}>
      <Link
        className={`p-8 ${styles.orderCardLink}`}
        to={`/profile/orders/${order._id}`}
      >
        <div className={styles.row}>
          <p className="text text_type_main-default">#{order.number}</p>
          <p className="text text_type_main-default">
            {formatRelativeDate(order.createdAt)}
          </p>
        </div>

        <h2 className={`text text_type_main-medium mb-5 mt-5`}>{order.name}</h2>
        <p className={`text text_type_main-default mb-5 ${order.status}`}>
          {statusesFormatter(order.status)}
        </p>
        <div className={styles.row}>
          <ul className={styles.ingredientList}>
            {ingredientsArrayBuns.map((ingredient, i) => {
              if (!ingredient) return;

              return (
                <FeedIngredientItem key={ingredient._id + i} ingredient={ingredient} />
              );
            })}
          </ul>
          <PriceBlock price={totalPrice} textClass="text text_type_main-medium" />
        </div>
      </Link>
    </li>
  );
};
