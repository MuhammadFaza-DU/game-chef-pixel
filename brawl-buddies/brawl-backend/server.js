import 'dotenv/config';
import http from 'node:http';
import express from 'express';
import cors from 'cors';

import { setupSocket } from './config/socket.js';
import { initDb } from './config/db.js';
import { initRedis } from './config/redis.js';
import logger from './src/utils/logger.js';

import authRoutes from './src/routes/authRoutes.js';
import playerRoutes from './src/routes/playerRoutes.js';
import leaderboardRoutes from './src/routes/leaderboardRoutes.js';
import achievementRoutes from './src/routes/achievementRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', game: 'Brawl Buddies: Chaos Kitchen' }));
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/achievements', achievementRoutes);

const server = http.createServer(app);
setupSocket(server);

async function start() {
  // initDb & initRedis bersifat best-effort: server tetap hidup walau DB belum siap.
  await initDb().catch((e) => logger.warn('MySQL belum tersedia:', e.message));
  await initRedis().catch((e) => logger.warn('Redis belum tersedia:', e.message));

  server.listen(PORT, () => logger.info(`🥊 Server siap di http://localhost:${PORT}`));
}

start();
