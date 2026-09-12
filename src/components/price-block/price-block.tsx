import { priceToCurrency } from '@/utils/price-formatter';
import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './price-block.module.css';

type TPriceBlock = {
  price: number;
};

export const PriceBlock = ({ price }: TPriceBlock): React.JSX.Element => {
  return (
    <p className={styles.priceBlock}>
      {priceToCurrency(price)} <CurrencyIcon type="primary" />
    </p>
  );
};
