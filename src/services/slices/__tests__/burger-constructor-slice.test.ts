import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
} from '../burger-constructor-slice';
import { createOrder } from '../order-slice';
import {
  biocutlet,
  craterBun,
  fluorescentBun,
  spicySauce,
  toConstructorIngredient,
} from './ingredients.mock';

import type { TConstructorState, TOrder } from '@utils-types';

const REQUEST_ID = 'test-request-id';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorBun = toConstructorIngredient(craterBun, 'bun-key');
const constructorCutlet = toConstructorIngredient(biocutlet, 'cutlet-key');
const constructorSauce = toConstructorIngredient(spicySauce, 'sauce-key');
const secondConstructorCutlet = toConstructorIngredient(biocutlet, 'second-cutlet-key');

const filledState: TConstructorState = {
  bun: constructorBun,
  ingredients: [constructorCutlet, constructorSauce, secondConstructorCutlet],
};

const orderIngredientIds = [craterBun._id, biocutlet._id, spicySauce._id, craterBun._id];

const createdOrder: TOrder = {
  _id: '66f7c1a2b27b06001c3e9a11',
  status: 'done',
  name: 'Краторный spicy био-марсианский бургер',
  createdAt: '2026-09-28T10:00:00.000Z',
  updatedAt: '2026-09-28T10:00:00.500Z',
  number: 98765,
  ingredients: orderIngredientIds,
};

describe('Редьюсер конструктора бургера', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('не меняет состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(filledState, { type: 'UNKNOWN' });

    expect(state).toBe(filledState);
  });

  describe('добавление ингредиента', () => {
    test('булка сохраняется отдельно от начинок', () => {
      const state = burgerConstructorReducer(initialState, addIngredient(craterBun));

      expect(state.bun).toMatchObject(craterBun);
      expect(typeof state.bun?.id).toBe('string');
      expect(state.ingredients).toEqual([]);
    });

    test('новая булка заменяет ранее добавленную', () => {
      const state = burgerConstructorReducer(filledState, addIngredient(fluorescentBun));

      expect(state.bun).toMatchObject(fluorescentBun);
      expect(state.bun?.id).not.toBe(constructorBun.id);
      expect(state.ingredients).toEqual(filledState.ingredients);
    });

    test('начинка добавляется в конец списка, булка не меняется', () => {
      const state = burgerConstructorReducer(filledState, addIngredient(spicySauce));

      expect(state.bun).toEqual(constructorBun);
      expect(state.ingredients).toHaveLength(filledState.ingredients.length + 1);
      expect(state.ingredients.slice(0, -1)).toEqual(filledState.ingredients);
      expect(state.ingredients.at(-1)).toMatchObject(spicySauce);
    });

    test('одинаковые начинки получают разные ключи', () => {
      const stateWithCutlet = burgerConstructorReducer(
        initialState,
        addIngredient(biocutlet)
      );
      const state = burgerConstructorReducer(stateWithCutlet, addIngredient(biocutlet));

      const [firstCutlet, secondCutlet] = state.ingredients;
      expect(firstCutlet._id).toBe(secondCutlet._id);
      expect(firstCutlet.id).not.toBe(secondCutlet.id);
    });
  });

  test('удаление начинки убирает только её, булка остаётся', () => {
    const state = burgerConstructorReducer(
      filledState,
      removeIngredient(constructorCutlet.id)
    );

    expect(state).toEqual({
      bun: constructorBun,
      ingredients: [constructorSauce, secondConstructorCutlet],
    });
  });

  describe('перемещение начинки', () => {
    test('вверх меняет её местами с предыдущей', () => {
      const state = burgerConstructorReducer(filledState, moveIngredientUp(1));

      expect(state.ingredients).toEqual([
        constructorSauce,
        constructorCutlet,
        secondConstructorCutlet,
      ]);
    });

    test('вверх не меняет порядок, если начинка уже первая', () => {
      const state = burgerConstructorReducer(filledState, moveIngredientUp(0));

      expect(state.ingredients).toEqual(filledState.ingredients);
    });

    test('вниз меняет её местами со следующей', () => {
      const state = burgerConstructorReducer(filledState, moveIngredientDown(1));

      expect(state.ingredients).toEqual([
        constructorCutlet,
        secondConstructorCutlet,
        constructorSauce,
      ]);
    });

    test('вниз не меняет порядок, если начинка уже последняя', () => {
      const lastIndex = filledState.ingredients.length - 1;

      const state = burgerConstructorReducer(filledState, moveIngredientDown(lastIndex));

      expect(state.ingredients).toEqual(filledState.ingredients);
    });
  });

  test('очистка возвращает конструктор в начальное состояние', () => {
    const state = burgerConstructorReducer(filledState, clearConstructor());

    expect(state).toEqual(initialState);
  });

  describe('оформление заказа', () => {
    test('createOrder.pending не меняет состав бургера', () => {
      const state = burgerConstructorReducer(
        filledState,
        createOrder.pending(REQUEST_ID, orderIngredientIds)
      );

      expect(state).toEqual(filledState);
    });

    test('createOrder.fulfilled очищает конструктор', () => {
      const state = burgerConstructorReducer(
        filledState,
        createOrder.fulfilled(createdOrder, REQUEST_ID, orderIngredientIds)
      );

      expect(state).toEqual(initialState);
    });

    test('createOrder.rejected сохраняет собранный бургер', () => {
      const state = burgerConstructorReducer(
        filledState,
        createOrder.rejected(
          new Error('Сервер недоступен'),
          REQUEST_ID,
          orderIngredientIds
        )
      );

      expect(state).toEqual(filledState);
    });
  });
});
