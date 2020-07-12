import axios from 'axios';
import { NextPageContext } from 'next';

export default ({ req }: NextPageContext) => {
  if (typeof window === 'undefined') {
    // we are on the server

    return axios.create({
      // prod
      baseURL: `http://www.ticketing-died-prod.xyz`,
      // baseURL: `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local`,
      headers: req?.headers,
    });
  } else {
    // we must be on the browser
    return axios.create({
      baseURL: '/',
    });
  }
};
