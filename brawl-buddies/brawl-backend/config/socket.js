import { Server } from 'socket.io';
import { registerCoopHandlers } from '../src/sockets/coopHandler.js';
import logger from '../src/utils/logger.js';

/** Setup Socket.io server untuk co-op realtime. */
export function setupSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_ORIGIN || '*' },
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Socket terhubung: ${socket.id}`);
    registerCoopHandlers(io, socket);

    socket.on('disconnect', () => logger.info(`❌ Socket putus: ${socket.id}`));
  });

  return io;
}
