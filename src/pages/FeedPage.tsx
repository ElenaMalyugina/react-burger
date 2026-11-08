import { FeedOrdersList } from '@/components/feed-orders-list/feed-orders-list';
import { connect, disconnect, feedOrders } from '@/services/feeds-service/slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { useEffect } from 'react';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(feedOrders);

  useEffect((): (() => void) => {
    dispatch(connect());

    return () => {
      dispatch(disconnect());
    };
  }, [dispatch]);

  return (
    <>
      <h1 className="title text text_type_main-large mt-10 mb-5 pl-5">Лента заказов</h1>
      <main className="main pl-5 pr-5">
        <section>
          <FeedOrdersList />
        </section>
        <section>{JSON.stringify(orders)}</section>
      </main>
    </>
  );
};
