import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { router } from '../decorators/routes.decorator.js';
import ErrorMiddleware from '../middlewares/error.middleware.js';
import { Console } from '../utils/console.js';
import { formatAccessLog } from '../utils/formatter.js';
import { includeDirectory } from '../utils/includeDirectory.js';
import { registerInjectable } from '../utils/registerInjectable.js';

const controllers = await includeDirectory('controllers', (classEntity) => {
  Console.info(`✅ Loaded controller ${classEntity.name}`);
});
registerInjectable(controllers);

const app = express();

// Log all requests
app.use((req, res, next) => {
  Console.log(formatAccessLog(req, res));
  next();
});

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// cors
app.use(cors());

// routes
app.use(router);

// error handling
app.use(ErrorMiddleware);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
