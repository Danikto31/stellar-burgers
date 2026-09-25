import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TConstructorState } from '@utils-types';

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;

export const selectConstructorPrice = (state: RootState): number => {
  const { bun, ingredients } = state.burgerConstructor;
  return (
    (bun ? bun.price * 2 : 0) + ingredients.reduce((sum, item) => sum + item.price, 0)
  );
};

/* Счётчики пересобираются только при изменении конструктора: иначе каждый
   рендер получал бы новый объект и перерисовывал список ингредиентов. */
export const selectIngredientsCounters = createSelector(
  [selectConstructorItems],
  ({ bun, ingredients }): Record<string, number> => {
    const counters: Record<string, number> = {};

    ingredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });
    if (bun) counters[bun._id] = 2;

    return counters;
  }
);
