import type { TIngredient } from '@utils-types';
import type { Location } from 'react-router-dom';

export type AppContentProps = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

/** Страница, поверх которой открыто модальное окно. */
export type TBackgroundLocationState = { background?: Location } | null;

export type OrderModalProps = {
  onClose: () => void;
};
