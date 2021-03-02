import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@rhtickets/common';
import { Corporate } from '../models/corporate';
import { CorporateCreatedPublisher } from '../events/publishers/corporate-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/corporate', 
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Prayer title is required'),
    body('content').not().isEmpty().withMessage('Prayer content is required'),
  ], 
  validateRequest, 
  async (req: Request, res: Response) => {
    const { title, content } = req.body;

    const corporate = Corporate.build({
      title,
      content,
      userId: req.currentUser!.id
    });
    await corporate.save();
    new CorporateCreatedPublisher(natsWrapper.client).publish({
      id: corporate.id,
      title: corporate.title,
      content: corporate.content,
      userId: corporate.userId,
      version: corporate.version
    });

    res.status(201).send(corporate);
  }
);

export { router as createCorporateRouter }