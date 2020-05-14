import axios from 'axios';
import { NextPageContext } from 'next';

export default ({ req }: NextPageContext) => {
  if (typeof window === 'undefined') {
    // we are on the server

    return axios.create({
      baseURL: `http://ingress-nginx.ingress-nginx.svc.cluster.local`,
      headers: req?.headers,
    });
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
