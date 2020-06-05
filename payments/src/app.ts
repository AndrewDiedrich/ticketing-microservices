// import 'dotenv'
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
//middlewares
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@andrewdied-tickets/common';
import { createChargeRouter } from './routes/new';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: process.env.NODE_ENV !== 'test',
  })
);

// auth middlewares
app.use(currentUser);
// routes
app.use(createChargeRouter);

// route not found error
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
