import { combineReducers } from '@reduxjs/toolkit';

import {
  burgerConstructorReducer,
  feedReducer,
  ingredientsReducer,
  orderReducer,
  userOrdersReducer,
  userReducer,
} from './slices';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  order: orderReducer,
  user: userReducer,
  userOrders: userOrdersReducer,
});
