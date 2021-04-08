import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from '@rhtickets/common';
import { Corporate } from '../models/corporate';

const router = express.Router();

router.get('/api/corporates/:id', async (req: Request, res: Response) => {
  const corporate = await Corporate.findById(req.params.id);
  
  if (!corporate) {
    throw new NotFoundError();
  }

  if (req.currentUser!.churchId !== corporate.churchId) {
    throw new NotAuthorizedError();
  }

  res.send(corporate);
});

export { router as showCorporateRouter };