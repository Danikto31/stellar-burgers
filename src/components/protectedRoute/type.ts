import type { ReactElement } from 'react';
import type { Location } from 'react-router-dom';

export type ProtectedRouteProps = {
  /** Маршрут только для неавторизованных: формы входа, регистрации и смены пароля. */
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export type TFromLocationState = { from?: Location } | null;
