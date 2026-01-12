import express from 'express';
import { 
  letestWtdata, 
  addQuestionWT, 
  addNoteWT, 
  addBookmarkWT, 
  addTimerWT, 
  getWeeklyTestData, 
  getAllWeeklyTests 
} from '../controllers/progressTracker.controller';
import { authenticate } from '../middleware/cookie-auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/latest', letestWtdata);
router.post('/addquestion', addQuestionWT);
router.post('/addnote', addNoteWT);
router.post('/addbookmark', addBookmarkWT);
router.post('/addtimer', addTimerWT);
router.get('/data/:WeeklytestName', getWeeklyTestData);
router.get('/all', getAllWeeklyTests);

export default router;