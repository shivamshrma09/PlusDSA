import express from 'express';
import { body } from 'express-validator';
import { 
  getContestStatus,
  joinContest,
  startCodingRound,
  trackSuspiciousActivity,
  submitTest,
  getAllContests,
  createContest
} from '../controllers/contest.controller';
import { handleValidationErrors } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/cookie-auth.middleware';

const router = express.Router();

router.get('/all', getAllContests);

router.post('/create', [
  body('contestName').notEmpty().withMessage('Contest name is required'),
  body('company_Name').notEmpty().withMessage('Company name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('roundDetails').isArray().withMessage('Round details must be an array'),
  handleValidationErrors
], createContest);

router.post('/status', authenticate, [
  body('contestID').notEmpty().withMessage('Contest ID is required'),
  handleValidationErrors
], getContestStatus);
router.post('/join', authenticate, [
  body('contestID').notEmpty().withMessage('Contest ID is required'),
  handleValidationErrors
], joinContest);

router.post('/start-coding', authenticate, [
  body('contestID').notEmpty().withMessage('Contest ID is required'),
  handleValidationErrors
], startCodingRound);

router.post('/track-activity', authenticate, [
  body('contestID').notEmpty().withMessage('Contest ID is required'),
  body('activity').notEmpty().withMessage('Activity is required'),
  body('timestamp').notEmpty().withMessage('Timestamp is required'),
  handleValidationErrors
], trackSuspiciousActivity);

router.post('/submit-test', authenticate, [
  body('contestID').notEmpty().withMessage('Contest ID is required'),
  body('questions').isArray().withMessage('Questions must be an array'),
  handleValidationErrors
], submitTest);

export default router;