import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';
type TOrderDetailsProps = {
  orderId: number | null;
};

export const OrderDetails = ({ orderId }: TOrderDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.orderDetails}>
      <h3 className="text text_type_digits-large mb-6">{orderId}</h3>
      <h3 className="text text_type_main-medium mb-10">Идентификатор заказа</h3>
      <div className={`mb-10 p-8 ${styles.status}`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className="text text_type_main-small">Ваш заказ начали готовить</p>
      <p className="text text_type_main-small text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
