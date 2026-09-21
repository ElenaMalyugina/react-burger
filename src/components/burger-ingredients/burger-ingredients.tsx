import { useModal } from '@/hooks/useModal';
import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

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

export const BurgerIngredients = ({
  ingredients,
  isLoading,
  isError,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [bunIngredients, setBunIngredients] = useState<TIngredient[]>([]);
  const [mainIngredients, setMainIngredients] = useState<TIngredient[]>([]);
  const [sauceIngredients, setSauceIngredients] = useState<TIngredient[]>([]);

  const [activeType, setActiveType] = useState('bun');
  const [activeIngredient, setActiveIngredient] = useState<TIngredient | null>(null);
  const { isModalOpen, openModal, closeModal } = useModal();

  const bunArticleRef = useRef<HTMLElement | null>(null);
  const mainArticleRef = useRef<HTMLElement | null>(null);
  const sauceArticleRef = useRef<HTMLElement | null>(null);

  const scrollContainerRef = useRef<HTMLElement | null>(null);

  const openModalDetails = (ingredient: TIngredient): void => {
    setActiveIngredient(ingredient);
    openModal();
  };

  const closeModalDetails = (): void => {
    closeModal();
    setActiveIngredient(null);
  };

  const BunIngredientsCards = bunIngredients.map((item) => (
    <IngredientCard
      key={item._id}
      ingredient={item}
      handleClick={() => openModalDetails(item)}
    />
  ));

  const MainIngredientsCards = mainIngredients.map((item) => (
    <IngredientCard
      key={item._id}
      ingredient={item}
      handleClick={() => openModalDetails(item)}
    />
  ));

  const SauceIngredientsCards = sauceIngredients.map((item) => (
    <IngredientCard
      key={item._id}
      ingredient={item}
      handleClick={() => openModalDetails(item)}
    />
  ));

  useEffect(() => {
    const bunIngredients = ingredients.filter((item) => item.type == 'bun') ?? [];
    setBunIngredients(bunIngredients);

    const mainIngredients = ingredients.filter((item) => item.type == 'main') ?? [];
    setMainIngredients(mainIngredients);

    const sauceIngredients = ingredients.filter((item) => item.type == 'sauce') ?? [];
    setSauceIngredients(sauceIngredients);
  }, [ingredients]);

  const handleScroll = (): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const getSectionTop = (ref: React.RefObject<HTMLElement | null>): number => {
      if (!ref.current) return Infinity;
      const rect = ref.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return rect.top - containerRect.top;
    };

    const threshold = 100;

    const sections = [
      { type: 'bun' as const, top: getSectionTop(bunArticleRef) },
      { type: 'main' as const, top: getSectionTop(mainArticleRef) },
      { type: 'sauce' as const, top: getSectionTop(sauceArticleRef) },
    ];

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].top <= threshold) {
        setActiveType(sections[i].type);
        return;
      }
    }
  };

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
      <section
        className={`box-with-scroll`}
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <article className="mb-20" ref={bunArticleRef}>
          <IngredientsList displayIngredientsType={'Булки'} ingredientsType={'bun'}>
            {BunIngredientsCards}
          </IngredientsList>
        </article>
        <article className="mb-20" ref={mainArticleRef}>
          <IngredientsList displayIngredientsType={'Начинки'} ingredientsType={'main'}>
            {MainIngredientsCards}
          </IngredientsList>
        </article>
        <article className="mb-20" ref={sauceArticleRef}>
          <IngredientsList displayIngredientsType={'Соусы'} ingredientsType={'sauce'}>
            {SauceIngredientsCards}
          </IngredientsList>
        </article>
      </section>
      {isModalOpen && (
        <Modal header={'Детали ингредиента'} handleCloseModal={closeModalDetails}>
          <IngredientDetails ingredient={activeIngredient} />
        </Modal>
      )}
    </section>
  );
};
