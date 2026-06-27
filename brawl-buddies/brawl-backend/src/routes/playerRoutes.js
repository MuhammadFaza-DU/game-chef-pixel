import { Router } from 'express';
import { getProgress, saveProgress } from '../controllers/playerController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/progress', authMiddleware, getProgress);
router.put('/progress', authMiddleware, saveProgress);

export default router;
