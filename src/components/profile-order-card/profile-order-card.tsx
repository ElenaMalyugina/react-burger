import { getIngredientsByIds, getTotalPrice } from '@/services/feeds-service/selectors';
import { useAppSelector } from '@/services/hooks';
import { formatRelativeDate } from '@/utils/data-formatter';
import { Link } from 'react-router-dom';

import { FeedIngredientItem } from '../feed-ingredient-item/feed-ingredient-item';
import { PriceBlock } from '../price-block/price-block';

import type { RootState } from '@/services/store';
import type { TOrder } from '@/utils/types';

import styles from '../styles/order-card.module.css';

type TProfileOrderCardProps = {
  order: TOrder;
};

export const ProfileOrderCard = ({
  order,
}: TProfileOrderCardProps): React.JSX.Element => {
  // Получаем все ингредиенты из стора (по ID)
  const ingredientsArray = useAppSelector((state: RootState) => {
    return getIngredientsByIds(state, order.ingredients);
  });

  const totalPrice = useAppSelector((state: RootState) => {
    return getTotalPrice(state, order.ingredients);
  });

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

        <div className={styles.row}>
          <ul className={styles.ingredientList}>
            {ingredientsArray.map((ingredient, i) => {
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
