import Link from 'next/link';
import { NextPageContext } from 'next';

const LandingPage = ({ currentUser, tickets }: any) => {
  const ticketList = tickets.map((ticket: any) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// ssr
LandingPage.getInitialProps = async (
  context: NextPageContext,
  client: any,
  currentUser: any
) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
