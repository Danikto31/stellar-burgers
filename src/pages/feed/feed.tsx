import { selectFeedOrders } from '@selectors';
import { fetchFeeds } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

/** Как часто лента подтягивает заказы с сервера, мс. */
const FEED_REFRESH_INTERVAL = 15000;

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  const handleGetFeeds = useCallback((): void => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
    const timerId = setInterval(handleGetFeeds, FEED_REFRESH_INTERVAL);

    return (): void => clearInterval(timerId);
  }, [handleGetFeeds]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
