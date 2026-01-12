import express from 'express';
import authRoutes from './auth.routes';
import sheetRoutes from './sheet.routes';
import playlistRoutes from './playlist.routes';
import userActivityRoutes from './userActivity';
import userProfileRoutes from './userProfile';
import learningPartnerRoutes from './learningPartner.routes';
import contestRoutes from './contest.routes';
import communicationRoutes from './communication.routes';
import weeklyTestRoutes from './weeklyTest.routes';
import spaceRepetitionRoutes from './spaceRepetition.routes';
import feedbackRoutes from './feedback.routes';
import weakAreasRoutes from './weakAreas.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/sheet', sheetRoutes);
router.use('/playlist', playlistRoutes);
router.use('/user-activity', userActivityRoutes);
router.use('/user-profile', userProfileRoutes);
router.use('/learning-partner', learningPartnerRoutes);
router.use('/contest', contestRoutes);
router.use('/communication', communicationRoutes);
router.use('/weeklytest', weeklyTestRoutes);
router.use('/spacerepetition', spaceRepetitionRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/weak-areas', weakAreasRoutes);

export default router;