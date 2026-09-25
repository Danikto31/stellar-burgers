import { createSelector } from '@reduxjs/toolkit';

import { BUNS_PER_BURGER } from '@utils/constants';

import type { RootState } from '@services/store';
import type { TConstructorState } from '@utils-types';

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;

export const selectConstructorPrice = (state: RootState): number => {
  const { bun, ingredients } = state.burgerConstructor;
  return (
    (bun ? bun.price * BUNS_PER_BURGER : 0) +
    ingredients.reduce((sum, item) => sum + item.price, 0)
  );
};

export const selectIngredientsCounters = createSelector(
  [selectConstructorItems],
  ({ bun, ingredients }): Record<string, number> => {
    const counters: Record<string, number> = {};

    ingredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });
    if (bun) counters[bun._id] = BUNS_PER_BURGER;

    return counters;
  }
);
