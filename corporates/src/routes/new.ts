import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, NotAuthorizedError } from '@rhtickets/common';
import { Corporate } from '../models/corporate';
import { CorporateCreatedPublisher } from '../events/publishers/corporate-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/corporates', 
  requireAuth, 
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('content').not().isEmpty().withMessage('Content is required')
  ], 
  validateRequest, 
  async (req: Request, res: Response) => {

    if (req.currentUser!.role === 'member') {
      throw new NotAuthorizedError();
    }

    const { title, content, category } = req.body;
    const active = true;

    const corporate = Corporate.build({
      title,
      content,
      category,
      active,
      userId: req.currentUser!.id,
      churchId: req.currentUser!.churchId,
    });
    await corporate.save();
    new CorporateCreatedPublisher(natsWrapper.client).publish({
      id: corporate.id,
      title: corporate.title,
      content: corporate.content,
      category: corporate.category,
      active: corporate.active,
      userId: corporate.userId,
      churchId: corporate.churchId,
      version: corporate.version
    });

    res.status(201).send(corporate);
  }
);

export { router as createCorporateRouter }