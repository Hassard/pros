import express, { Request, Response } from 'express';
import { Corporate } from '../models/corporate';

const router = express.Router();

router.get('/api/corporates', async (req: Request, res: Response) => {    
  
  const corporates = await Corporate.find({ 
    churchId: req.currentUser!.churchId 
  });

  res.send(corporates);
});

export { router as indexCorporateRouter };