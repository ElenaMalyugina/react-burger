import { useAppDispatch } from '@/services/hooks';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
} from '@/services/ingredients-service/slice';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useSelector(getIngredients);
  const isLoading = useSelector(getIngredientsLoading);
  const error = useSelector(getIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients
          ingredients={ingredients}
          isLoading={isLoading}
          isError={error !== null}
        />
        <BurgerConstructor
          ingredients={ingredients}
          isLoading={isLoading}
          isError={error !== null}
        />
      </main>
    </div>
  );
};

export default App;
