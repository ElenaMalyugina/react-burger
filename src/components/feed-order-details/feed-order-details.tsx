import { getIngredientsByIds, getTotalPrice } from '@/services/feeds-service/selectors';
import { useAppSelector } from '@/services/hooks';
import { formatRelativeDate } from '@/utils/data-formatter';
import { statusesFormatter } from '@/utils/statuses-formatter';

import { PriceBlock } from '../price-block/price-block';

import type { RootState } from '@/services/store';
import type { TIngredient, TOrder } from '@/utils/types';

import styles from './feed-order-details.module.css';

type TFeedOrderDetails = {
  order: TOrder;
};

type TExtendedIngredient = TIngredient & {
  count: number;
};

type TIngredientRow = {
  ingredient: TExtendedIngredient;
};

const ingredientsRowsArrayBuilder = (
  items: (TIngredient | undefined)[]
): TExtendedIngredient[] => {
  const map = new Map<string, TExtendedIngredient>();

  for (const item of items) {
    if (!item) continue;
    if (map.has(item._id)) {
      const ingr = map.get(item._id);

      if (ingr) {
        ingr.count += 1;
      }
    } else {
      map.set(item._id, {
        ...item,
        count: 1,
      });
    }
  }

  return [...map.values()];
};

const IngredientRow = ({ ingredient }: TIngredientRow): React.JSX.Element => {
  return (
    <tr className={`text text_type_main-default mb-2`}>
      <td>
        <div className={styles.ingredientImgWrapper}>
          <img
            className={styles.ingredientImg}
            src={ingredient.image_mobile}
            alt={ingredient.name}
          />
        </div>
      </td>
      <td>
        <span>{ingredient.name}</span>
      </td>
      <td style={{ textAlign: 'right' }}>
        <span
          style={{ display: 'flex', whiteSpace: 'nowrap', justifyContent: 'flex-end' }}
        >
          {ingredient.count}
          &times;
          <PriceBlock price={ingredient.price} textClass={styles.price} />
        </span>
      </td>
    </tr>
  );
};

export const FeedOrderDetails = ({ order }: TFeedOrderDetails): React.JSX.Element => {
  const ingredientsArray = useAppSelector((state: RootState) => {
    return getIngredientsByIds(state, order.ingredients);
  });

  const totalPrice = useAppSelector((state: RootState) => {
    return getTotalPrice(state, order.ingredients);
  });

  console.log(JSON.stringify(ingredientsArray));

  return (
    <div className={styles.orderModalBody}>
      <p className={`text text_type_main-default ${styles.orderNumber}`}>
        {order.number}
      </p>
      <h2 className={`text text_type_main-medium mb-5`}>{order.name}</h2>
      <p className={`text text_type_main-default mb-5 ${styles[order.status]}`}>
        {statusesFormatter(order.status)}
      </p>
      <h3 className="text text_type_main-medium mb-5">Состав</h3>
      <div className={`box-with-scroll ${styles.tableWrapper}`}>
        <table className={`${styles.ingredientsTable}`}>
          <tbody>
            {ingredientsRowsArrayBuilder(ingredientsArray).map((ingr) => {
              return <IngredientRow ingredient={ingr} key={ingr._id} />;
            })}
          </tbody>
        </table>
      </div>
      <table className={styles.ingredientsTableTotal}>
        <tr>
          <td className="text text_type_main-default" colSpan={2}>
            {formatRelativeDate(order.createdAt)}
          </td>
          <td>
            <PriceBlock
              textClass={`text text_type_main-default ${styles.totalPrice}`}
              price={totalPrice}
            />
          </td>
        </tr>
      </table>
    </div>
  );
};
