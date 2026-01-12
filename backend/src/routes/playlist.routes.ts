import express from 'express';
import { body } from 'express-validator';
import { 
  createPlaylist,
  addQuestionToPlaylist,
  getAllPlaylists,
  getPlaylistById
} from '../controllers/sheet.controller';
import { authenticate } from '../middleware/cookie-auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = express.Router();

router.use(authenticate);

router.post('/create', [
  body('playlistName').notEmpty().withMessage('Playlist name is required'),
  handleValidationErrors
], createPlaylist);

router.post('/add-question', [
  body('playlistId').notEmpty().withMessage('Playlist ID is required'),
  body('sheetname').notEmpty().withMessage('Sheet name is required'),
  body('questionNumber').notEmpty().withMessage('Question number is required'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']).withMessage('Valid difficulty required'),
  handleValidationErrors
], addQuestionToPlaylist);

router.get('/all', getAllPlaylists);
router.get('/:playlistId', getPlaylistById);

export default router;









