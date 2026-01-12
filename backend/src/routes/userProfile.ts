import express from 'express';
import { body } from 'express-validator';
import { addUserProfile, getUserProfile } from '../controllers/userProfile.controller';
import { authenticate } from '../middleware/cookie-auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/add', [
  body('username').optional().notEmpty().withMessage('Username cannot be empty'),
  body('collegeName').optional().notEmpty().withMessage('College name cannot be empty'),
  body('About').optional().isLength({ max: 500 }).withMessage('About must be less than 500 characters'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('problems_per_day').optional().isInt({ min: 1, max: 100 }).withMessage('Problems per day must be between 1-100'),
  body('reminders_per_day').optional().isInt({ min: 1, max: 10 }).withMessage('Reminders per day must be between 1-10'),
  handleValidationErrors
], authenticate, addUserProfile);

router.get('/get', authenticate, getUserProfile);

export default router;