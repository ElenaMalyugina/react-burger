import { useOrderCard } from '@/hooks/useOrderCard';
import { formatRelativeDate } from '@/utils/data-formatter';
import { ingredientsRowsArrayBuilder } from '@/utils/ingredients-filter';
import { statusesFormatter } from '@/utils/statuses-formatter';

import { IngredientRow } from '../inrdedient-row/ingredient-row';
import { PriceBlock } from '../price-block/price-block';

import type { TOrder } from '@/utils/types';

import styles from './feed-order-details.module.css';

type TFeedOrderDetails = {
  order: TOrder;
};

export const FeedOrderDetails = ({ order }: TFeedOrderDetails): React.JSX.Element => {
  const ingredientsArray = useOrderCard(order.ingredients).ingredientsArray;

  const totalPrice = useOrderCard(order.ingredients).totalPrice;

  return (
    <div className={styles.orderModalBody}>
      <p className={`text text_type_main-medium ${styles.orderNumber}`}>
        #{order.number}
      </p>
      <h2 className={`text text_type_main-medium mb-5`}>{order.name}</h2>
      <p className={`text text_type_main-default mb-5 ${order.status}`}>
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
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
};
