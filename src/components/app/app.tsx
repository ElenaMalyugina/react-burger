import { authSend } from '@/services/auth-service/thunks';
import { useAppDispatch } from '@/services/hooks';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { router } from '../../router/router';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(authSend(null));
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
