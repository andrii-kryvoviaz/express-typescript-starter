import { NextFunction, Request, Response } from 'express';

import { Console } from '../utils/console.js';

export const ErrorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { name, message, stack } = err;
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction && statusCode === 500) {
    stack && Console.error(stack);
  }

  if (isProduction && statusCode === 500) {
    message = 'Internal Server Error';
  }

  res.status(statusCode).json({ error: message });
};

export default ErrorMiddleware;
