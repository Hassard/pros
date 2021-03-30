import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@rhtickets/common';
import { Church } from '../models/church';
import { ChurchCreatedPublisher } from '../events/publishers/church-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/churches', 
  requireAuth, 
  [
    body('name').not().isEmpty().withMessage('Name is required')
  ], 
  validateRequest, 
  async (req: Request, res: Response) => {
    const { name } = req.body;

    const church = Church.build({
      name,
      userId: req.currentUser!.id
    });
    await church.save();
    new ChurchCreatedPublisher(natsWrapper.client).publish({
      id: church.id,
      name: church.name,
      userId: church.userId,
      version: church.version
    });

    res.status(201).send(church);
  }
);

export { router as createChurchRouter }