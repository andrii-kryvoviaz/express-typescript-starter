import 'reflect-metadata';

import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';

import app from './server/http.js';
import { upgradeHttp } from './server/websocket.js';
import { Console } from './utils/console.js';

dotenv.config();

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || '';
const isWsEnabled = process.env.WS_ENABLED === 'true';

if (!mongoUrl.length) {
  Console.warn('ℹ️  MONGO_URL is not defined');
}

const server = http.createServer(app);

try {
  await mongoose.connect(mongoUrl, {});
  Console.info('✅ Connected to MongoDB');

  if (isWsEnabled) {
    upgradeHttp(server);
    Console.info('✅ Websocket server is attached to HTTP');
  }

  server.listen(port, () =>
    Console.info(`🚀 Server listening on port ${port}`)
  );
} catch (error: any) {
  Console.error('❌ Failed to connect to MongoDB');
  Console.error(error.message);
}
