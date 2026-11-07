import { authResult, isAuthResult } from '@/services/auth-service/slice';
import { useAppSelector } from '@/services/hooks';
import { Navigate, useLocation } from 'react-router-dom';

export type TLocationState = {
  from: {
    pathname: string;
  };
};

type TComponent = {
  onlyUnAuth: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: TComponent): React.JSX.Element | null => {
  const isAuthChecked = useAppSelector(isAuthResult);
  const user = useAppSelector(authResult);
  const location = useLocation();
  const from = (location.state as TLocationState | null)?.from ?? { pathname: '/' };

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};
