import { FeedOrdersList } from '@/components/feed-orders-list/feed-orders-list';
import { connect, disconnect, feedOrders } from '@/services/feeds-service/slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import { useEffect } from 'react';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(feedOrders) ?? [];

  useEffect((): (() => void) => {
    void dispatch(fetchIngredients());

    void dispatch(connect());

    return () => {
      void dispatch(disconnect());
    };
  }, [dispatch]);

  return (
    <>
      <h1 className="title text text_type_main-large mt-10 mb-5 pl-5">Лента заказов</h1>
      <main className="main pl-5 pr-5">
        <section className={`box-with-scroll`}>
          <FeedOrdersList orders={orders} />
        </section>
        <section></section>
      </main>
    </>
  );
};
