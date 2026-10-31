import { authResult } from '@/services/auth-service/slice';
import {useSelector} from 'react-redux';
import {Navigate, useLocation} from 'react-router-dom';

type TComponent = {
  onlyUnAuth: boolean;
  component: React.JSX.Element;
}

export const ProtectedRoute = ({onlyUnAuth = false, component}: TComponent): React.JSX.Element | null => {
  const isAuthChecked = useSelector(authResult)?.success;
  const user = useSelector(authResult)?.user;
  const location = useLocation();

  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && user) {
    const {from} = location.state || {from: {pathname: '/'}};
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{from: location}} replace />;
  }

  return component;
};
