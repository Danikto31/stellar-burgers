import { logoutUser } from '@slices';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  /* Отдельный редирект не нужен: без пользователя защищённый маршрут сам
     отправит на форму входа. */
  const handleLogout = (): void => {
    void dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
