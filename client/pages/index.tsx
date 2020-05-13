import axios from 'axios';

const LandingPage = ({ currentuser }) => {
  console.log(currentuser);
  return <h1>home page: </h1>;
};

// ssr
LandingPage.getInitialProps = async () => {
  if (typeof window === 'undefined') {
    //
    const { data } = await axios.get(
      `http:/ingress-nginx.ingress-nginx.svc.cluster.local/api/users/currentuser`,
      {
        headers: {
          Host: 'ticketing.dev',
        },
      }
    );
    return data;
  } else {
    // we are on the browser
    // base url can be ''
    const { data } = await axios.get(`/api/users/currentuser`);
    return data;
  }
};

export default LandingPage;
