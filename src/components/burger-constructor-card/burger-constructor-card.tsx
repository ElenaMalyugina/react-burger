import { deleteIngredient } from '@/services/burger-constructor-service/slice';
import { useAppDispatch } from '@/services/hooks';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor-card.module.css';

type TSortItem = {
  ingredient: TIngredient;
  index: number;
};

type TBurgerConstructorCard = {
  ingredient: TIngredient;
  displayType?: 'top' | 'bottom' | undefined;
  postfix?: string;
  index?: number;
  onSort?: (dragIndex: number, hoverIndex: number) => void;
};

export const BurgerConstructorCard = ({
  ingredient,
  displayType,
  postfix,
  index,
  onSort,
}: TBurgerConstructorCard): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const [{ isDragging }, dragRef] = useDrag({
    type: 'sortedIngredient',
    item: (): TSortItem => ({ ingredient, index: index ?? 0 }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop<TSortItem>({
    accept: 'sortedIngredient',
    hover(item) {
      if (!onSort || typeof index !== 'number') return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      onSort(dragIndex, hoverIndex);

      // ВАЖНО: мутируем item.index, чтобы следующий hover
      // считался уже с новой позиции
      item.index = hoverIndex;
    },
  });

  const handleDelete = (ingredient: TIngredient): void => {
    dispatch(deleteIngredient(ingredient));
  };

  return (
    <li
      className={`${styles.burgerConstructorCard} ${isDragging ? 'opacity-90' : ''}`}
      ref={(node) => {
        dragRef(node);
        dropRef(node);
      }}
    >
      {displayType == undefined && (
        <button className={styles.dragButton}>
          <DragIcon type="primary" />
        </button>
      )}
      <ConstructorElement
        handleClose={() => {
          handleDelete(ingredient);
        }}
        isLocked={displayType !== undefined}
        price={ingredient.price}
        text={`${ingredient.name} ${postfix ?? postfix}`}
        thumbnail={ingredient.image}
        type={displayType}
      />
    </li>
  );
};
