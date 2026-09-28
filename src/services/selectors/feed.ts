import type { RootState } from '@services/store';
import type { TFeedState, TOrder } from '@utils-types';

export const selectFeed = (state: RootState): TFeedState => state.feed;

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectFeedLoading = (state: RootState): boolean => state.feed.isLoading;
