import express, { Request, Response } from 'express';
import { Church } from '../models/church';

const router = express.Router();

router.get('/api/churches', async (req: Request, res: Response) => {    
  
  const churches = await Church.find();

  res.send(churches);
});

export { router as indexChurchRouter };