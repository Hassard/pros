import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from '@rhtickets/common';
import { Church } from '../models/church';

const router = express.Router();

router.get('/api/churches/:id', async (req: Request, res: Response) => {
  const church = await Church.findById(req.params.id);
  
  if (!church) {
    throw new NotFoundError();
  }

  if (req.currentUser!.role !== 'owner') {
    throw new NotAuthorizedError();
  }

  res.send(church);
});

export { router as showChurchRouter };