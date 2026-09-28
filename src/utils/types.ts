export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

/** Состояние загрузки данных с сервера, общее для слайсов. */
export type TRequestState = {
  isLoading: boolean;
  error: string | null;
};

export type TIngredientsState = TRequestState & {
  items: TIngredient[];
};

export type TFeedState = TRequestState & TOrdersData;

export type TUserOrdersState = TRequestState & Pick<TOrdersData, 'orders'>;

export type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  viewedOrder: TOrder | null;
  isViewedOrderLoading: boolean;
  error: string | null;
};

export type TUserState = {
  user: TUser | null;
  /* Пока авторизация не проверена, защищённые маршруты не знают, показывать
     содержимое или отправлять на форму входа. */
  isAuthChecked: boolean;
  isLoading: boolean;
  authError: string | null;
  updateUserError: string | null;
};
