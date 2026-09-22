import { useAppDispatch } from '@/services/hooks';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from '@/services/ingredients-service/slice';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import {
  BurgerConstructor,
  type TDraggableElement,
} from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);
  const error = useSelector(getIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const [elements, setElements] = useState<TIngredient[]>([]);

  useEffect(() => {
    setElements(ingredients);
  }, [ingredients]);

  const [constructorIngredients, setConstructorIngredients] = useState<TIngredient[]>(
    []
  );

  const handleDrop = (draggedIngredient: TDraggableElement): void => {
    // если булка  - заменить.
    // в остальных случаях - добавлять
    setConstructorIngredients([
      ...constructorIngredients,
      ...elements.filter((element) => element._id === draggedIngredient.ingredient._id),
    ]);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients
            ingredients={ingredients}
            isLoading={isLoading}
            isError={error !== null}
          />
          <BurgerConstructor
            ingredients={constructorIngredients}
            onDropHandler={handleDrop}
          />
        </DndProvider>
      </main>
    </div>
  );
};

export default App;
