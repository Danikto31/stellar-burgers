import { selectFeed } from '@selectors';
import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';
import { MAX_FEED_ORDER_NUMBERS, ORDER_STATUSES } from '@utils/constants';

import type { TOrder } from '@utils-types';

const getOrderNumbers = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, MAX_FEED_ORDER_NUMBERS);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector(selectFeed);

  const readyOrders = getOrderNumbers(feed.orders, ORDER_STATUSES.done);

  const pendingOrders = getOrderNumbers(feed.orders, ORDER_STATUSES.pending);

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
