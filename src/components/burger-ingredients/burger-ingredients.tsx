import { useModal } from '@/hooks/useModal';
import { useAppDispatch } from '@/services/hooks';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from '@/services/ingredients-service/slice';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  selectIngredient,
  removeSelectedIngredient,
  selectActiveIngredient,
} from '@services/selected-ingredient-service/slice';

import { IngredientCard } from '../Ingredient-card/Ingredient-card';
import { IngredientDetails } from '../Ingredient-details/Ingredient-details';
import { IngredientsList } from '../ingredients-list/ingredients-list';
import Modal from '../modal/modal';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  //получение списка всех ингредиентов
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);
  const isError = useSelector(getIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, []);

  //установка активного таба по умолчанию
  const [activeType, setActiveType] = useState('bun');

  const bunArticleRef = useRef<HTMLElement | null>(null);
  const mainArticleRef = useRef<HTMLElement | null>(null);
  const sauceArticleRef = useRef<HTMLElement | null>(null);

  const scrollContainerRef = useRef<HTMLElement | null>(null);

  //модальное окно с деталями ингредиента
  const { isModalOpen, openModal, closeModal } = useModal();
  const activeIngredient = useSelector(selectActiveIngredient);

  const openModalDetails = (ingredient: TIngredient): void => {
    openModal();
    dispatch(selectIngredient(ingredient));
  };

  const closeModalDetails = (): void => {
    closeModal();
    dispatch(removeSelectedIngredient());
  };

  //распределение ингредиентов по табам
  const [bunIngredients, setBunIngredients] = useState<TIngredient[]>([]);
  const [mainIngredients, setMainIngredients] = useState<TIngredient[]>([]);
  const [sauceIngredients, setSauceIngredients] = useState<TIngredient[]>([]);

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

  //скролл
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
