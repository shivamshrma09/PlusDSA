import express from 'express';
import { body } from 'express-validator';
import { 
  addQuestion, 
  addNote, 
  addBookmark, 
  addTimer, 
  getSheetData, 
  getAllSheets, 
  getSolvedQuestions, 
  getNotes, 
  getBookmarks, 
  getTimers,
  getLeaderboard
} from '../controllers/sheet.controller';
import { authenticate, AuthRequest } from '../middleware/cookie-auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);

router.use(authenticate);

router.post('/add-question', [
  body('sheetname').notEmpty().withMessage('Sheet name is required'),
  body('questionNumber').notEmpty().withMessage('Question number is required'),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']).withMessage('Valid difficulty required'),
  handleValidationErrors
], addQuestion);

router.post('/add-note', [
  body('sheetname').notEmpty().withMessage('Sheet name is required'),
  body('questionNumber').notEmpty().withMessage('Question number is required'),
  body('noteText').notEmpty().withMessage('Note text is required'),
  handleValidationErrors
], addNote);

router.post('/add-bookmark', [
  body('sheetname').notEmpty().withMessage('Sheet name is required'),
  body('questionNumber').notEmpty().withMessage('Question number is required'),
  handleValidationErrors
], addBookmark);

router.post('/add-timer', [
  body('sheetname').notEmpty().withMessage('Sheet name is required'),
  body('questionNumber').notEmpty().withMessage('Question number is required'),
  body('time').isNumeric().withMessage('Time must be a number'),
  handleValidationErrors
], addTimer);

router.get('/sheet/:sheetname', getSheetData);
router.get('/sheets', getAllSheets);
router.get('/solved/:sheetname', getSolvedQuestions);
router.get('/notes/:sheetname', getNotes);
router.get('/bookmarks/:sheetname', getBookmarks);
router.get('/timers/:sheetname', getTimers);

export default router;