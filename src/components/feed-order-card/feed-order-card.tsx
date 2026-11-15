import { useOrderCard } from '@/hooks/useOrderCard';
import { formatRelativeDate } from '@/utils/data-formatter';
import { ingredientsRowsArrayBuilder } from '@/utils/ingredients-filter';
import { Link } from 'react-router-dom';

import { FeedIngredientItem } from '../feed-ingredient-item/feed-ingredient-item';
import { PriceBlock } from '../price-block/price-block';

import type { TOrder } from '@/utils/types';

import styles from '../styles/order-card.module.css';

type TFeedOrderCardProps = {
  order: TOrder;
};

export const FeedOrderCard = ({ order }: TFeedOrderCardProps): React.JSX.Element => {
  const ingredientsArray = useOrderCard(order.ingredients).ingredientsArray;

  const totalPrice = useOrderCard(order.ingredients).totalPrice;

  return (
    <li className={styles.orderCard} key={order._id}>
      <Link className={`p-8 ${styles.orderCardLink}`} to={`/feed/${order._id}`}>
        <div className={styles.row}>
          <p className="text text_type_main-default">#{order.number}</p>
          <p className="text text_type_main-default">
            {formatRelativeDate(order.createdAt)}
          </p>
        </div>

        <h2 className={`text text_type_main-medium mb-5 mt-5`}>{order.name}</h2>

        <div className={styles.row}>
          <ul className={styles.ingredientList}>
            {ingredientsRowsArrayBuilder(ingredientsArray).map((ingredient, i) => {
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
