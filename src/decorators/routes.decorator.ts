import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';

export const router = Router();

interface RouteOptions {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  middlewares?: any[];
}

export function Route(options: RouteOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const callableRoute = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const instance = Container.get(target.constructor.name);
        await descriptor.value.apply(instance, [req, res, next]);
      } catch (error) {
        next(error);
      }
    };

    const middlewares = [...(options.middlewares || []), callableRoute];

    (router as any)[options.method.toLocaleLowerCase()](
      options.path,
      ...middlewares
    );
  };
}
