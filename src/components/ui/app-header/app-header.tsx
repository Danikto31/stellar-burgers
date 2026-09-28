import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { Link, NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

const getLinkClass = (isActive: boolean): string =>
  clsx(styles.link, isActive && styles.link_active);

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const { pathname } = useLocation();
  /* Страница ингредиента не вложена в маршрут конструктора, но открывается
     из него, поэтому ссылка на конструктор остаётся подсвеченной. */
  const isConstructorActive = pathname === '/' || pathname.startsWith('/ingredients');

  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <NavLink to="/" className={getLinkClass(isConstructorActive)}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Link to="/">
            <Logo className="" />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <NavLink to="/profile" className={({ isActive }) => getLinkClass(isActive)}>
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">
                  {userName ?? 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
