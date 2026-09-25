import type { TTabMode } from './types';

/** Имя cookie с access-токеном. */
export const ACCESS_TOKEN_KEY = 'accessToken';

/** Ключ localStorage с refresh-токеном. */
export const REFRESH_TOKEN_KEY = 'refreshToken';

/** Ключ localStorage: письмо для сброса пароля уже запрошено. */
export const RESET_PASSWORD_KEY = 'resetPassword';

export const INGREDIENT_TYPES = {
  bun: 'bun',
  main: 'main',
  sauce: 'sauce',
} as const satisfies Record<string, TTabMode>;

/** Булка одна, но в бургере она и сверху, и снизу. */
export const BUNS_PER_BURGER = 2;

export const ORDER_STATUSES = {
  done: 'done',
  pending: 'pending',
} as const;

/** Сколько номеров заказов помещается в колонку на странице ленты. */
export const MAX_FEED_ORDER_NUMBERS = 20;
