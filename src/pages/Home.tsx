import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

export const Home = (): React.JSX.Element => {
  return (
    <>
      <h1 className="title text text_type_main-large mt-10 mb-5 pl-5">
        Соберите бургер
      </h1>
      <main className="main pl-5 pr-5">
        <DndProvider backend={HTML5Backend}>
          <BurgerIngredients />
          <BurgerConstructor />
        </DndProvider>
      </main>
    </>
  );
};
