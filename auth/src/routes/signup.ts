import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@rhtickets/common';
import { Church } from '../models/church';

import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ], 
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, role, churchId } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password, role });
    await user.save();

    if (churchId) {
      // Mark the user as having a church if one is sent
      user.set({ churchId: churchId });
      await user.save();
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      churchId: user.churchId
    }, process.env.JWT_KEY!);

    //Store it on session object
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };