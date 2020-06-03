import { NextPageContext } from 'next';

const OrderIndex = ({ orders }: any) => {
  return (
    <ul>
      {orders.map((order: any) => {
        return (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context: NextPageContext, client: any) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
