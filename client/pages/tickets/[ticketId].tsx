import { NextPageContext } from 'next';
import useRequest from '@/hooks/use-request';

const TicketShow = (props: any) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: props.ticket.id,
    },
    onSuccess: (order: any) => console.log(order),
  });

  return (
    <div>
      <h1>{props.ticket.title}</h1>
      <h4>Price: {props.ticket.price}</h4>
      {errors}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context: NextPageContext, client: any) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
