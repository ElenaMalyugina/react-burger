import { priceToCurrency } from '@/utils/price-formatter';
import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './price-block.module.css';

type TPriceBlock = {
  price: number;
  textClass?: string;
};

export const PriceBlock = ({ price, textClass }: TPriceBlock): React.JSX.Element => {
  return (
    <p className={`${textClass} ${styles.priceBlock}`}>
      {priceToCurrency(price)} <CurrencyIcon type="primary" />
    </p>
  );
};
