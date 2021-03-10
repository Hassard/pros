import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError, BadRequestError } from '@rhtickets/common';
import { Corporate } from '../models/corporate';
import { CorporateUpdatedPublisher } from '../events/publishers/corporate-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/corporate/:id', 
  requireAuth, 
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('content')
    .not()
    .isEmpty()
    .withMessage('Content is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const corporate = await Corporate.findById(req.params.id);

    if (!corporate) {
      throw new NotFoundError();
    }

    if (corporate.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    corporate.set({
      title: req.body.title,
      content: req.body.content
    });
    await corporate.save();
    new CorporateUpdatedPublisher(natsWrapper.client).publish({
      id: corporate.id,
      title: corporate.title,
      content: corporate.content,
      userId: corporate.userId,
      version: corporate.version
    });

    res.send(corporate);
  }
);

export { router as updateCorporateRouter };
