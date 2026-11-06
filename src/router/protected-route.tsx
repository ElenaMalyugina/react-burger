import { authResult, isAuthResult } from '@/services/auth-service/slice';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type TLocationState = {
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
  const isAuthChecked = useSelector(isAuthResult);
  const user = useSelector(authResult);
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
