// This file configures our express app
// index.ts starts the app

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@rhtickets/common';
import { indexChurchRouter } from './routes/index';
import { createChurchRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // Test using supertest which is http ... so http for test, https for prod
    //secure: process.env.NODE_ENV !== 'test'
    secure: false
  })
);
app.use(currentUser);
app.use(indexChurchRouter);
app.use(createChurchRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };