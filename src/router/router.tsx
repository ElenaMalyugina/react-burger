import { Layout } from '@/components/layout/layout';
import { FeedPage } from '@/pages/FeedPage/FeedPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { Home } from '@/pages/Home';
import { LoginPage } from '@/pages/LoginPage';
import { NotFound } from '@/pages/NotFound';
import { ProfileOrderPage } from '@/pages/ProfileOrderPage';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage';
import { ProfileRootPage } from '@/pages/ProfileRootPage/ProfileRootPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { createBrowserRouter } from 'react-router-dom';

import { IngredientModal } from '../components/ingredient-modal/ingredient-modal';
import { ProtectedRoute } from './protected-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: 'ingredients/:id',
            element: <IngredientModal />,
          },
        ],
      },
      {
        path: 'register',
        element: <ProtectedRoute component={<RegisterPage />} onlyUnAuth={true} />,
      },
      {
        path: 'login',
        element: <ProtectedRoute component={<LoginPage />} onlyUnAuth={true} />,
      },
      {
        path: 'forgot-password',
        element: <ProtectedRoute component={<ForgotPasswordPage />} onlyUnAuth={true} />,
      },
      {
        path: 'reset-password',
        element: <ProtectedRoute component={<ResetPasswordPage />} onlyUnAuth={true} />,
      },
      {
        path: 'feed',
        element: <FeedPage />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute component={<ProfileRootPage />} onlyUnAuth={false} />,
        children: [
          {
            path: '',
            element: <ProfilePage />,
          },
          {
            path: 'orders',
            element: <ProfileOrderPage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <NotFound />,
  },
]);
