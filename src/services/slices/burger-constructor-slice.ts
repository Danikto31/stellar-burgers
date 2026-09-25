import { createSlice, nanoid } from '@reduxjs/toolkit';

import { createOrder } from './order-slice';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TIngredient,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>): void => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }
        state.ingredients.push(action.payload);
      },
      /* Одинаковых начинок в бургере может быть несколько, поэтому каждой
         добавленной нужен собственный ключ помимо _id. */
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>): void => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredientUp: (state, action: PayloadAction<number>): void => {
      const index = action.payload;
      if (index <= 0) return;
      const [moved] = state.ingredients.splice(index, 1);
      state.ingredients.splice(index - 1, 0, moved);
    },
    moveIngredientDown: (state, action: PayloadAction<number>): void => {
      const index = action.payload;
      if (index >= state.ingredients.length - 1) return;
      const [moved] = state.ingredients.splice(index, 1);
      state.ingredients.splice(index + 1, 0, moved);
    },
    clearConstructor: (): TConstructorState => initialState,
  },
  extraReducers: (builder): void => {
    /* Оформленный заказ уходит на сервер — конструктор освобождаем. */
    builder.addCase(createOrder.fulfilled, () => initialState);
  },
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
