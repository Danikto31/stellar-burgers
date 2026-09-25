import type { RootState } from '@services/store';
import type { TOrder } from '@utils-types';

export const selectUserOrders = (state: RootState): TOrder[] => state.userOrders.orders;
