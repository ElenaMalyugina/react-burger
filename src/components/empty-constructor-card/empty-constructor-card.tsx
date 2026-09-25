import outerStyles from '../burger-constructor-card/burger-constructor-card.module.css';
import styles from './empty-constructor-card.module.css';

type TEmptyConstructorCard = {
  text: string;
  type?: string;
  isHighlighted: boolean;
};

export const EmptyConstructorCard = ({
  text,
  type,
  isHighlighted,
}: TEmptyConstructorCard): React.JSX.Element => {
  const addCssClass = (type: string | undefined): string => {
    if (type === 'top') return 'constructor-element_pos_top';
    if (type === 'bottom') return 'constructor-element_pos_bottom';

    return '';
  };

  return (
    <li className={`${outerStyles.burgerConstructorCard}`}>
      <div
        className={`constructor-element ${styles.constructorEmptyElement} ${addCssClass(type)} ${isHighlighted ? styles.highlighted : ''}`}
      >
        <span className="constructor-element__text">{text}</span>
      </div>
    </li>
  );
};
