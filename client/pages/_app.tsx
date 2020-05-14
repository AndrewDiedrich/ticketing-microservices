import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

import { AppProps } from 'next/app';

// wrapper around all pages

const AppComponent = (
  { currentUser }: any,
  { Component, pageProps }: AppProps
) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
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
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
