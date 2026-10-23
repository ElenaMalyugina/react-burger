import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { createBrowserRouter } from 'react-router-dom';

import { IngredientModal } from '../ingredient-modal/ingredient-modal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'ingredients/:id',
        element: <IngredientModal />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
