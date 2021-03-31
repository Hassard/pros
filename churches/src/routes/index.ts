import express, { Request, Response } from 'express';
import { requireAuth, NotAuthorizedError } from '@rhtickets/common';
import { Church } from '../models/church';

const router = express.Router();

router.get('/api/churches', requireAuth, async (req: Request, res: Response) => {    
  
  if (req.currentUser!.role !== 'owner') {
    throw new NotAuthorizedError();
  }
  
  const churches = await Church.find();

  res.send(churches);
});

export { router as indexChurchRouter };