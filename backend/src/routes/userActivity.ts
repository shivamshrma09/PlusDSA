import express from 'express';
import { trackUserVisit, getUserActivity, getUserActivityById } from '../controllers/userActivityController';
import { authenticate } from '../middleware/cookie-auth.middleware';

const router = express.Router();

router.post('/track-visit', authenticate, trackUserVisit);
router.get('/activity', authenticate, getUserActivity);
router.get('/user/:userId', getUserActivityById);

export default router;