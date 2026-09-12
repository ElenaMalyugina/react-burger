import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { IngredientsList } from '../ingredients-list/ingredients-list';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

const displayTypes = [
  {
    type: 'bun',
    displayType: 'Булки',
  },
  {
    type: 'main',
    displayType: 'Начинки',
  },
  {
    type: 'sauce',
    displayType: 'Соусы',
  },
];

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);

  const [activeType, setActiveType] = useState('bun');
  const [activeDisplayType, setActiveDisplayType] = useState('');

  useEffect(() => {
    const preparedIngredients =
      ingredients.filter((item) => item.type == activeType) ?? [];
    setFilteredIngredients(preparedIngredients);

    const displayType =
      displayTypes.find((item) => item.type == activeType)?.displayType ?? '';
    setActiveDisplayType(displayType);
  }, [activeType]);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={activeType == 'bun'}
            onClick={() => {
              setActiveType('bun');
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={activeType == 'main'}
            onClick={() => {
              setActiveType('main');
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={activeType == 'sauce'}
            onClick={() => {
              setActiveType('sauce');
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <IngredientsList
        ingredients={filteredIngredients}
        ingredientsType={activeDisplayType}
      />
    </section>
  );
};
