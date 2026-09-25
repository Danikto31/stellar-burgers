import {
  selectConstructorItems,
  selectConstructorPrice,
  selectOrderModalData,
  selectOrderRequest,
  selectUser,
} from '@selectors';
import { clearOrderModalData, createOrder } from '@slices';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectConstructorPrice);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    /* Заказ оформляет только авторизованный пользователь, поэтому гостя
       отправляем на форму входа и запоминаем, откуда он пришёл. */
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    void dispatch(
      createOrder([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id,
      ])
    );
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModalData());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
