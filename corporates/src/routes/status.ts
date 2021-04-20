import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError } from '@rhtickets/common';
import { Corporate } from '../models/corporate';
import { CorporateUpdatedPublisher } from '../events/publishers/corporate-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/corporates/status/', 
  requireAuth, 
  [
    body('id').not().isEmpty().withMessage('Id is required'),
    body('active').not().isEmpty().withMessage('Status is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.body);
    const corporate = await Corporate.findById(req.body.id);

    if (!corporate) {
      throw new NotFoundError();
    }

    if (req.currentUser!.churchId !== corporate.churchId) {
      throw new NotAuthorizedError();
    }

    corporate.set({
      active: req.body.active
    });
    await corporate.save();
    new CorporateUpdatedPublisher(natsWrapper.client).publish({
      id: corporate.id,
      title: corporate.title,
      content: corporate.content,
      category: corporate.category,
      active: corporate.active,
      userId: corporate.userId,
      churchId: corporate.churchId,
      version: corporate.version
    });

    res.send(corporate);
  }
);

export { router as updateStatusCorporateRouter };
