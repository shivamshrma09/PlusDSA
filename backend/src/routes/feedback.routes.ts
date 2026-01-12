import express from 'express';
import { body } from 'express-validator';
import { submitFeedback } from '../controllers/feedback.controller';
import { authenticate } from '../middleware/cookie-auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = express.Router();

router.use(authenticate);

router.post('/submit', [
  body('message').notEmpty().withMessage('Message is required'),
  handleValidationErrors
], submitFeedback);

export default router;