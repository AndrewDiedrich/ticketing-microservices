import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '@/api/build-client';
import Header from '../components/header';

// wrapper around all pages

const AppComponent = ({ currentUser, Component, pageProps }: any) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// ssr
AppComponent.getInitialProps = async (appContext: any) => {
  // create client
  const client = buildClient(appContext.ctx);
  //call get
  const { data } = await client.get(`/api/users/currentuser`);

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
