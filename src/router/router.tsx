import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { createBrowserRouter } from 'react-router-dom';

import { IngredientModal } from '../components/ingredient-modal/ingredient-modal';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoginPage } from '@/pages/LoginPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { FeedPage } from '@/pages/FeedPage';
import { ProfileRootPage } from '@/pages/ProfileRootPage';
import { ProfileOrderPage } from '@/pages/ProfileOrderPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { Layout } from '@/components/layout/layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home/>,
        children:[
          {
            path: 'ingredients/:id',
            element: <IngredientModal />,
          },
        ]
      },
      {
        path: 'register',
        element: <RegisterPage/>
      },
      {
        path: 'login',
        element: <LoginPage/>
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage/>
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage/>
      },
      {
        path: 'feed',
        element: <FeedPage />
      },
      {
        path: 'profile',
        element: <ProfileRootPage />,
        children:[
          {
            path: '',
            element: <ProfilePage />,
          },
          {
            path: 'orders',
            element: <ProfileOrderPage />,
          }
        ]
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);
