import { FeedOrdersList } from '@/components/feed-orders-list/feed-orders-list';
import { FeedStatusesBlock } from '@/components/feed-statuses-block/feed-statuses-block';
import {
  connect,
  disconnect,
  feedOrders,
  feedTotal,
  feedTotalToday,
} from '@/services/feeds-service/slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchIngredients } from '@/services/ingredients-service/thunks';
import { useEffect } from 'react';

import styles from './FeedPage.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(feedOrders) ?? [];
  const total = useAppSelector(feedTotal);
  const totalToday = useAppSelector(feedTotalToday);

  const doneOrders = orders.filter((order) => order.status == 'done').slice(0, 20);
  const pendingOrders = orders.filter((order) => order.status == 'pending').slice(0, 20);

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
        <section className={`box-with-scroll pr-10 ${styles.section}`}>
          <FeedOrdersList orders={orders} />
        </section>
        <section className={`pl-10 ${styles.section}`}>
          <div className={styles.statusesBlock}>
            <article className={styles.statusesArticle}>
              <h2 className="text text_type_main-medium mb-5">Готовы</h2>
              <FeedStatusesBlock orders={doneOrders} status="done" />
            </article>
            <article>
              <h2 className="text text_type_main-medium mb-5">В работе</h2>
              <FeedStatusesBlock orders={pendingOrders} status="pending" />
            </article>
          </div>
          <article>
            <h2 className="text text_type_main-medium mb-5">Выполнено за все время</h2>
            <p className="text text_type_main-large mb-5">{total}</p>
          </article>
          <article>
            <h2 className="text text_type_main-medium mb-5">Выполнено за сегодня</h2>
            <p className="text text_type_main-large mb-5">{totalToday}</p>
          </article>
        </section>
      </main>
    </>
  );
};
