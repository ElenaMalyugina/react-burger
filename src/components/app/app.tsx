import { ingredientsService } from '@/services/ingredients-service/ingredients-service';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    ingredientsService
      .getIngredients()
      .then((ingredients) => {
        setIngredients(ingredients);
        setIsLoading(false);
        setIsError(false);
      })
      .catch((error) => {
        console.error('Ошибка загрузки ингредиентов:', error);
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            ingredients={ingredients}
            isLoading={isLoading}
            isError={isError}
          />
          <BurgerConstructor
            ingredients={ingredients}
            isLoading={isLoading}
            isError={isError}
          />
        </main>
      </div>
    </>
  );
};

export default App;
