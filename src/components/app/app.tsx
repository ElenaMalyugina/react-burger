import { RouterProvider } from 'react-router-dom';
import { router } from '../../router/router';
import { useAppDispatch } from '@/services/hooks';
import { useEffect } from 'react';
import { authSend } from '@/services/auth-service/thunks';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authSend(null));
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;
