import { Request, Response } from 'express';

export function formatAccessLog(req: Request, res: Response) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  return `[${req.method}] ${req.url} from ${ip}`;
}
