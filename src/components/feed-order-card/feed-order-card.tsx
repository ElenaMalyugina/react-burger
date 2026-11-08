import { useAppSelector } from '@/services/hooks';
import { getIngredientById } from '@/services/ingredients-service/slice';
import { Link } from 'react-router-dom';

import type { RootState } from '@/services/store';
import type { TOrder } from '@/utils/types';

import styles from './feed-order-card.module.css';

type TIngredientItemProps = {
  ingredientId: string;
};

const IngredientItem = ({ ingredientId }: TIngredientItemProps): React.JSX.Element => {
  const ingredient = useAppSelector((state: RootState) =>
    getIngredientById(state, ingredientId)
  );

  return (
    <li>
      <img src={ingredient?.image} alt={ingredient?.name} title={ingredient?.name} />
    </li>
  );
};

type TFeedOrderCardProps = {
  order: TOrder;
};

export const FeedOrderCard = ({ order }: TFeedOrderCardProps): React.JSX.Element => {
  return (
    <li className={styles.feedOrderCard}>
      <Link className={`p-8 ${styles.feedOrderCardLink}`} to={`feed/${order._id}`}>
        <p>{order.number}</p>
        <p>{order.createdAt}</p>
        <h2>{order.name}</h2>
        <ul>
          {order.ingredients.map((ingredientId, i) => (
            <IngredientItem key={`${ingredientId}-${i}`} ingredientId={ingredientId} />
          ))}
        </ul>
      </Link>
    </li>
  );
};
