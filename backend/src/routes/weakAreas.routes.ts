import express from 'express';
import { getWeakAreas, getWeakAreasByTopic, clearWeakAreas } from '../controllers/weakAreas.controller';
import { authenticate } from '../middleware/cookie-auth.middleware';

const router = express.Router();

router.use(authenticate);
router.get('/', getWeakAreas);
router.get('/by-topic', getWeakAreasByTopic);
router.delete('/clear', clearWeakAreas);

export default router;