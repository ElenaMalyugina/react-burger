import { authSend } from '@/services/auth-service/thunks';
import { useAppDispatch } from '@/services/hooks';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '../../router/router';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(authSend(null));

    void dispatch(fetchIngredients());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
