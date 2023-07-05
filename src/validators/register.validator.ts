import { NextFunction, Request, Response } from 'express';

import { ValidatorErrors } from '../contracts/validatorResponse.js';
import { ValidatorResponseFactory } from '../factories/validatorResponse.factory.js';
import { UserModel } from '../models/user/user.model.js';
import { User } from '../models/user/user.type.js';

export const RegisterValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: ValidatorErrors = {};
  const user: Partial<User> = req.body;

  if (!user.name) {
    errors.name = 'Name is required';
  }

  if (!user.email) {
    errors.email = 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (user.email && !emailRegex.test(user.email)) {
    errors.email = 'Email is invalid';
  }

  const userExists = await UserModel.findOne({ email: user.email });

  if (userExists) {
    errors.email = 'Email already exists';
  }

  if (!user.password) {
    errors.password = 'Password is required';
  }

  if (user.password && user.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (user.password && !user.password.match(/[0-9]/g)) {
    errors.password = 'Password must contain a number';
  }

  const { isValid } = ValidatorResponseFactory.create(errors);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  next();
};
