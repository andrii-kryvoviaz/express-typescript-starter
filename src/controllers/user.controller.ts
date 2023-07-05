import { Request, Response } from 'express';
import { Inject } from 'typedi';

import { Route } from '../decorators/routes.decorator.js';
import { UserFactory } from '../factories/user.factory.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { UserModel } from '../models/user/user.model.js';
import { User } from '../models/user/user.type.js';
import { AuthService } from '../services/auth.service.js';
import { LoginValidator } from '../validators/login.validator.js';
import { RegisterValidator } from '../validators/register.validator.js';

export class UserController {
  constructor(@Inject() private authService: AuthService) {}

  @Route({ path: '/user', method: 'POST', middlewares: [RegisterValidator] })
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    if (!user) {
      throw new Error('User creation failed.');
    }

    const token = this.authService.generateToken(user._id);
    this.authService.setTokenCookie(res, token);

    res.status(201).json(UserFactory.extended(user));
  }

  @Route({ path: '/user/login', method: 'POST', middlewares: [LoginValidator] })
  async login(req: Request & { user: User }, res: Response) {
    const { user } = req;

    const token = this.authService.generateToken(user._id);
    this.authService.setTokenCookie(res, token);

    res.status(200).json(UserFactory.extended(user));
  }

  @Route({ path: '/user/logout', method: 'POST' })
  async logout(req: Request, res: Response) {
    this.authService.clearTokenCookie(res);

    res.status(200).json({ message: 'Logout successful' });
  }

  @Route({
    path: '/user',
    method: 'GET',
    middlewares: [AuthMiddleware],
  })
  async getUser(req: Request & { userId?: string }, res: Response) {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(UserFactory.extended(user));
  }
}
