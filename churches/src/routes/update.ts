import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, requireAuth, NotAuthorizedError } from '@rhtickets/common';
import { Church } from '../models/church';
import { ChurchUpdatedPublisher } from '../events/publishers/church-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/churches/:id', 
  requireAuth, 
  [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Name is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const church = await Church.findById(req.params.id);

    if (!church) {
      throw new NotFoundError();
    }

    if (req.currentUser!.role !== 'owner') {
      throw new NotAuthorizedError();
    }

    church.set({
      name: req.body.name
    });
    await church.save();
    new ChurchUpdatedPublisher(natsWrapper.client).publish({
      id: church.id,
      name: church.name,
      userId: church.userId,
      version: church.version
    });

    res.send(church);
  }
);

export { router as updateChurchRouter };
