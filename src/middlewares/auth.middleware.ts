import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const AuthMiddleware = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token || null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
};

export default AuthMiddleware;
