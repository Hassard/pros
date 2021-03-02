import express, { Request, Response } from 'express';
import { NotFoundError } from '@rhtickets/common';
import { Corporate } from '../models/corporate';

const router = express.Router();

router.get('/api/corporate/:id', async (req: Request, res: Response) => {
  const corporate = await Corporate.findById(req.params.id);
  
  if (!corporate) {
    throw new NotFoundError();
  }

  res.send(corporate);
});

export { router as showCorporateRouter };