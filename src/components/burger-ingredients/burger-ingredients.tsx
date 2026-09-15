import { useModal } from '@/hooks/useModal';
import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { IngredientCard } from '../Ingredient-card/Ingredient-card';
import { IngredientDetails } from '../Ingredient-details/Ingredient-details';
import { IngredientsList } from '../ingredients-list/ingredients-list';
import Modal from '../modal/modal';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  isLoading: boolean;
  isError: boolean;
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
  isLoading,
  isError,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [filteredIngredients, setFilteredIngredients] = useState(ingredients);

  const [activeType, setActiveType] = useState('bun');
  const [activeDisplayType, setActiveDisplayType] = useState('');
  const [activeIngredient, setActiveIngredient] = useState<TIngredient | null>(null);
  const { isModalOpen, openModal, closeModal } = useModal();

  const openModalDetails = (ingredient: TIngredient): void => {
    setActiveIngredient(ingredient);
    openModal();
  };

  const closeModalDetails = (): void => {
    closeModal();
    setActiveIngredient(null);
  };

  const IngredientsCards = filteredIngredients.map((item) => (
    <IngredientCard
      key={item._id}
      ingredient={item}
      handleClick={() => openModalDetails(item)}
    />
  ));

  useEffect(() => {
    const preparedIngredients =
      ingredients.filter((item) => item.type == activeType) ?? [];
    setFilteredIngredients(preparedIngredients);

    const displayType =
      displayTypes.find((item) => item.type == activeType)?.displayType ?? '';
    setActiveDisplayType(displayType);
  }, [ingredients, activeType]);

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
      {isLoading && <Preloader />}
      {isError && (
        <p className="text text_type_main-small mt-2 mb-2">
          Не удалось получить список ингредиентов
        </p>
      )}
      <IngredientsList ingredientsType={activeDisplayType}>
        {IngredientsCards}
      </IngredientsList>
      {isModalOpen && (
        <Modal header={'Детали ингредиента'} handleCloseModal={closeModalDetails}>
          <IngredientDetails ingredient={activeIngredient} />
        </Modal>
      )}
    </section>
  );
};
