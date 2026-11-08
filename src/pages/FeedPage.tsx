import { FeedOrdersList } from '@/components/feed-orders-list/feed-orders-list';

export const FeedPage = (): React.JSX.Element => {
  return (
    <>
      <h1 className="title text text_type_main-large mt-10 mb-5 pl-5">Лента заказов</h1>
      <main className="main pl-5 pr-5">
        <section>
          <FeedOrdersList />
        </section>
        <section></section>
      </main>
    </>
  );
};
