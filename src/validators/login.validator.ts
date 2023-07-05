import { NextFunction, Request, Response } from 'express';

import { ValidatorErrors } from '../contracts/validatorResponse.js';
import { ValidatorResponseFactory } from '../factories/validatorResponse.factory.js';
import { UserModel } from '../models/user/user.model.js';
import { User } from '../models/user/user.type.js';

export const LoginValidator = async (
  req: Request & { user: User },
  res: Response,
  next: NextFunction
) => {
  const errors: ValidatorErrors = {};

  const { email, password } = req.body;

  if (!email) {
    errors.email = 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    errors.email = 'Email is invalid';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  const { isValid } = ValidatorResponseFactory.create(errors);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await UserModel.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.user = user;
  next();
};
