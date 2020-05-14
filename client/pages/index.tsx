import buildClient from '../api/build-client';
import { NextPageContext } from 'next';

const LandingPage = ({ currentUser }: any) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in </h1>
  );
};

// ssr
LandingPage.getInitialProps = async (context: NextPageContext) => {
  // create client
  const client = buildClient(context);
  //call get
  const { data } = await client.get(`/api/users/currentuser`);
  console.log('Landing Page!!!', data);
  return data;
};

export default LandingPage;
