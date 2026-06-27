import { roomManager } from './roomManager.js';
import logger from '../utils/logger.js';

/**
 * Handler co-op realtime. Sinkronisasi posisi/input/event antar 2 pemain.
 * Server hanya me-relay + validasi ringan (anti-cheat sederhana).
 */
export function registerCoopHandlers(io, socket) {
  // Buat room baru (host)
  socket.on('room:create', (cb) => {
    const roomId = roomManager.create(socket.id);
    socket.join(roomId);
    cb?.({ ok: true, roomId });
    logger.info(`🏠 Room dibuat: ${roomId}`);
  });

  // Gabung via invite link
  socket.on('room:join', (roomId, cb) => {
    const result = roomManager.join(roomId, socket.id);
    if (!result.ok) return cb?.(result);
    socket.join(roomId);
    io.to(roomId).emit('room:player-joined', { playerId: socket.id });
    cb?.({ ok: true, room: result.room });
  });

  // Relay posisi & input ke partner
  socket.on('player:state', ({ roomId, state }) => {
    socket.to(roomId).emit('partner:state', { playerId: socket.id, state });
  });

  // Relay event game (hit, cook, dll)
  socket.on('game:event', ({ roomId, event }) => {
    socket.to(roomId).emit('partner:event', { playerId: socket.id, event });
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        roomManager.leave(roomId, socket.id);
        // reconnect window 30 detik sesuai PRD
        socket.to(roomId).emit('partner:disconnected', { playerId: socket.id, reconnectMs: 30000 });
      }
    }
  });
}
