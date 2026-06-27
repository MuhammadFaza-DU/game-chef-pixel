import { Router } from 'express';
import { listAchievements, unlockAchievement } from '../controllers/achievementController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware, listAchievements);
router.post('/unlock', authMiddleware, unlockAchievement);

export default router;
