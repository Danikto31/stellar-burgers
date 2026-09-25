import type { RootState } from '@services/store';
import type { TIngredient } from '@utils-types';

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

export const selectIngredientById =
  (id: string | undefined) =>
  (state: RootState): TIngredient | undefined =>
    state.ingredients.items.find((item) => item._id === id);
