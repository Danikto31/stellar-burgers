import { selectIsAuthChecked, selectUser } from '@selectors';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { ProtectedRouteProps, TFromLocationState } from './type';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  /* Пока ответ на /auth/user не получен, редиректить нельзя: иначе авторизованного
     пользователя выбросит из личного кабинета при перезагрузке страницы. */
  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as TFromLocationState)?.from;
    return <Navigate to={from ?? '/'} replace />;
  }

  return children;
};
