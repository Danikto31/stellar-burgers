import { logoutUser } from '@slices';
import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Переходим на вход явно: иначе защищённый маршрут запомнит /profile, и
     после следующего входа пользователя вернёт в профиль, а не в конструктор. */
  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => {
        /* Токены остались действующими — пользователь по-прежнему авторизован. */
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
