import express from 'express';
import { 
  latestSRdata, 
  addQuestionSR, 
  addNoteSR, 
  addBookmarkSR, 
  addTimerSR, 
  getSpaceRepetitionData, 
  getAllSpaceRepetitions 
} from '../controllers/progressTracker.controller';
import { authenticate } from '../middleware/cookie-auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/latest', latestSRdata);
router.post('/addquestion', addQuestionSR);
router.post('/addnote', addNoteSR);
router.post('/addbookmark', addBookmarkSR);
router.post('/addtimer', addTimerSR);
router.get('/data/:SpaceRepetitionName', getSpaceRepetitionData);
router.get('/all', getAllSpaceRepetitions);

export default router;