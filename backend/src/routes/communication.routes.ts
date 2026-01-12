import express from 'express';
import { 
  getChannels, 
  createChannel, 
  getChannelMessages, 
  sendMessage, 
  joinChannel 
} from '../controllers/communication.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/channels', authMiddleware, getChannels);
router.post('/channels', authMiddleware, createChannel);
router.post('/channels/:channelId/join', authMiddleware, joinChannel);

router.get('/channels/:channelId/messages', authMiddleware, getChannelMessages);
router.post('/messages', authMiddleware, sendMessage);

export default router;