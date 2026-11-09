import { useAppSelector } from '@/services/hooks';
import { getIngredientById } from '@/services/ingredients-service/slice';
import { formatRelativeDate } from '@/utils/data-formatter';
import { Link } from 'react-router-dom';

import { FeedIngredientItem } from '../feed-ingredient-item/feed-ingredient-item';
import { PriceBlock } from '../price-block/price-block';

import type { RootState } from '@/services/store';
import type { TIngredient, TOrder } from '@/utils/types';

import styles from './feed-order-card.module.css';

type TFeedOrderCardProps = {
  order: TOrder;
};

export const FeedOrderCard = ({ order }: TFeedOrderCardProps): React.JSX.Element => {
  const ingredientsArray = useAppSelector((state: RootState) => {
    return order.ingredients.reduce((acc: TIngredient[], id) => {
      const ingr = getIngredientById(state, id);
      if (ingr) {
        acc.push(ingr);
      }
      return acc;
    }, []);
  });

  const totalPrice = ingredientsArray.reduce((acc, item) => {
    return acc + (item?.price ?? 0);
  }, 0);

  return (
    <li className={styles.feedOrderCard}>
      <Link className={`p-8 ${styles.feedOrderCardLink}`} to={`feed/${order._id}`}>
        <div className={styles.row}>
          <p className="text text_type_main-default">#{order.number}</p>
          <p className="text text_type_main-default">
            {formatRelativeDate(order.createdAt)}
          </p>
        </div>

        <h2 className={`text text_type_main-medium mb-5 mt-5`}>{order.name}</h2>

        <div className={styles.row}>
          <ul className={styles.feedIngredientList}>
            {ingredientsArray.map((ingredient) => (
              <FeedIngredientItem key={ingredient?._id} ingredient={ingredient} />
            ))}
          </ul>

          <PriceBlock price={totalPrice} textClass="text text_type_main-medium" />
        </div>
      </Link>
    </li>
  );
};
