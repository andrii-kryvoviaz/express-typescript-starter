import WebSocket, { WebSocketServer } from 'ws';

import { Console } from '../utils/console.js';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message) => {
    Console.log(`Received message: ${message}`);
  });

  ws.send('Hello WebSocket!');
});

export const upgradeHttp = (server: any) => {
  server.on('upgrade', (req: any, socket: any, head: any) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });
};

export default wss;
