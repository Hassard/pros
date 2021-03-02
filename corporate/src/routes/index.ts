import express, { Request, Response } from 'express';
import { Corporate } from '../models/corporate';

const router = express.Router();

router.get('/api/corporate', async (req: Request, res: Response) => {
  const corporate = await Corporate.find({
    orderId: undefined,
  });

  res.send(corporate);
});

export { router as indexCorporateRouter }

