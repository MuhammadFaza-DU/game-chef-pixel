import { Router } from 'express';
import { submitScore, getLeaderboard } from '../controllers/leaderboardController.js';
import { apiLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/', getLeaderboard);
router.post('/', apiLimiter, submitScore);

export default router;
