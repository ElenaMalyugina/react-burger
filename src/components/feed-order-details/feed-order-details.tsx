import { getIngredientsByIds, getTotalPrice } from '@/services/feeds-service/selectors';
import { useAppSelector } from '@/services/hooks';
import { formatRelativeDate } from '@/utils/data-formatter';

import type { RootState } from '@/services/store';
import type { TOrder } from '@/utils/types';

type TFeedOrderDetails = {
  order: TOrder;
};

export const FeedOrderDetails = ({ order }: TFeedOrderDetails): React.JSX.Element => {
  const ingredientsArray = useAppSelector((state: RootState) => {
    return getIngredientsByIds(state, order.ingredients);
  });

  const totalPrice = useAppSelector((state: RootState) => {
    return getTotalPrice(state, order.ingredients);
  });

  return (
    <div>
      <p>{order.number}</p>
      <h1>{order.name}</h1>
      <p>{order.status}</p>
      <h3>Состав</h3>
      {ingredientsArray.map((el, i) => {
        if (!el) return;

        return <p key={el._id + i}>{el?.name}</p>;
      })}
      <p>{formatRelativeDate(order.createdAt)}</p>
      <p>{totalPrice}</p>
    </div>
  );
};
