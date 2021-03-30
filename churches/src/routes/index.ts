import express, { Request, Response } from 'express';
import { requireAuth } from '@rhtickets/common';
import { Church } from '../models/church';

const router = express.Router();

router.get('/api/churches', requireAuth, async (req: Request, res: Response) => {
  const churches = await Church.find({ 
    userId: req.currentUser!.id 
  });

  res.send(churches);
});

export { router as indexChurchRouter };