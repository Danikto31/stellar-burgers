import { selectUserOrders } from '@selectors';
import { fetchUserOrders } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

/** Как часто история заказов подтягивает их статусы с сервера, мс. */
const ORDERS_REFRESH_INTERVAL = 15000;

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    const loadOrders = (): void => {
      void dispatch(fetchUserOrders());
    };

    loadOrders();
    const timerId = setInterval(loadOrders, ORDERS_REFRESH_INTERVAL);

    return (): void => clearInterval(timerId);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
