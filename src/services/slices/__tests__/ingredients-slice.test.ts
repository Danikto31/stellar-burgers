import { fetchIngredients, ingredientsReducer } from '../ingredients-slice';
import { ingredients } from './ingredients.mock';

import type { TIngredientsState } from '@utils-types';

const REQUEST_ID = 'test-request-id';
const ERROR_MESSAGE = 'Сервер недоступен';

const initialState: TIngredientsState = {
  items: [],
  isLoading: true,
  error: null,
};

describe('Редьюсер ингредиентов', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('не меняет состояние при неизвестном экшене', () => {
    const currentState: TIngredientsState = {
      items: ingredients,
      isLoading: false,
      error: null,
    };

    const state = ingredientsReducer(currentState, { type: 'UNKNOWN' });

    expect(state).toBe(currentState);
  });

  describe('загрузка ингредиентов с сервера', () => {
    test('pending включает загрузку и сбрасывает прошлую ошибку', () => {
      const currentState: TIngredientsState = {
        items: [],
        isLoading: false,
        error: ERROR_MESSAGE,
      };

      const state = ingredientsReducer(
        currentState,
        fetchIngredients.pending(REQUEST_ID)
      );

      expect(state).toEqual({ items: [], isLoading: true, error: null });
    });

    test('fulfilled сохраняет полученные ингредиенты и выключает загрузку', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.fulfilled(ingredients, REQUEST_ID)
      );

      expect(state).toEqual({ items: ingredients, isLoading: false, error: null });
    });

    test('rejected сохраняет текст ошибки и выключает загрузку', () => {
      const state = ingredientsReducer(
        initialState,
        fetchIngredients.rejected(new Error(ERROR_MESSAGE), REQUEST_ID)
      );

      expect(state).toEqual({ items: [], isLoading: false, error: ERROR_MESSAGE });
    });

    test('rejected без текста ошибки сохраняет сообщение по умолчанию', () => {
      const state = ingredientsReducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: {},
      });

      expect(state).toEqual({
        items: [],
        isLoading: false,
        error: 'Неизвестная ошибка',
      });
    });
  });
});
