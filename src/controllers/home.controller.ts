import { Request, Response } from 'express';

import { Route } from '../decorators/routes.decorator.js';

export class HomeController {
  @Route({ path: '/', method: 'GET' })
  async index(req: Request, res: Response) {
    res.status(200).json({ message: 'Hello world' });
  }
}
