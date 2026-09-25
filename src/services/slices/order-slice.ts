import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder, TOrderState } from '@utils-types';

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  viewedOrder: null,
  isViewedOrderLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]): Promise<TOrder> => {
    const data = await orderBurgerApi(ingredients);
    return data.order;
  }
);

/* Заказ запрашивается по номеру отдельно: на страницу заказа можно попасть по
   прямой ссылке, когда ни ленты, ни истории заказов в сторе ещё нет. */
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number): Promise<TOrder | null> => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0] ?? null;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state): void => {
      state.orderModalData = null;
      state.error = null;
    },
  },
  extraReducers: (builder): void => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isViewedOrderLoading = true;
        state.viewedOrder = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isViewedOrderLoading = false;
        state.viewedOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isViewedOrderLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearOrderModalData } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
