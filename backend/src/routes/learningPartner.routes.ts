import express from 'express';
import { body } from 'express-validator';
import { 
  createLearningPartnerPost, 
  getAllLearningPartners, 
  getUserLearningPartnerPosts,
  deleteLearningPartnerPost,
  sendConnectionRequest
} from '../controllers/learningPartner.controller';
import { handleValidationErrors } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/cookie-auth.middleware';

const router = express.Router();

router.post('/create', authenticate, [
  body('college').notEmpty().withMessage('College is required'),
  body('year').notEmpty().withMessage('Year is required'),
  body('tags').isArray().withMessage('Tags must be an array'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  handleValidationErrors
], createLearningPartnerPost);

router.get('/all', authenticate, getAllLearningPartners);
router.get('/my-posts', authenticate, getUserLearningPartnerPosts);
router.post('/send-request', authenticate, [
  body('recipientId').notEmpty().withMessage('Recipient ID is required'),
  handleValidationErrors
], sendConnectionRequest);
router.delete('/:postId', authenticate, deleteLearningPartnerPost);

export default router;