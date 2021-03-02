// This file configures our express app
// index.ts starts the app

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@rhtickets/common';
import { createCorporateRouter } from './routes/new';
import { showCorporateRouter } from './routes/show';
import { indexCorporateRouter } from './routes/index';
import { updateCorporateRouter } from './routes/update';

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
app.use(createCorporateRouter);
app.use(showCorporateRouter);
app.use(indexCorporateRouter);
app.use(updateCorporateRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };