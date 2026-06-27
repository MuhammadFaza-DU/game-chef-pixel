import { randomUUID } from 'node:crypto';

/** Manajemen room co-op in-memory (maks 2 pemain per room). */
const rooms = new Map();

export const roomManager = {
  create(hostId) {
    const id = randomUUID().slice(0, 6);
    rooms.set(id, { id, players: [hostId], createdAt: Date.now() });
    return id;
  },

  join(roomId, playerId) {
    const room = rooms.get(roomId);
    if (!room) return { ok: false, reason: 'ROOM_NOT_FOUND' };
    if (room.players.length >= 2) return { ok: false, reason: 'ROOM_FULL' };
    room.players.push(playerId);
    return { ok: true, room };
  },

  leave(roomId, playerId) {
    const room = rooms.get(roomId);
    if (!room) return;
    room.players = room.players.filter((p) => p !== playerId);
    if (room.players.length === 0) rooms.delete(roomId);
  },

  get(roomId) {
    return rooms.get(roomId);
  },
};
