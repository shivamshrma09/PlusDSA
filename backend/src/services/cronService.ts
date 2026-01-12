import cron from 'node-cron';
import { UserModel } from '../models/User.model';
const questionRecommendations = require('../data/questionRecommendations');

export const startWeeklyTestCron = () => {
  cron.schedule('0 0 * * 0', async () => {
    
    try {
      const users = await UserModel.find({});
      
      for (const user of users) {
        await generateWeeklyTestForUser(user._id);
      }
      
    } catch (error) {
      console.error(' Error generating weekly tests:', error);
    }
  });
  
};

const generateWeeklyTestForUser = async (userId: any) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user || !user.AllsheetData[0]) return;

    const sheetData = user.AllsheetData[0];
    
    const bookmarkedQuestions = sheetData.bookmarkedquestions || [];
    const bookmarkedIds = bookmarkedQuestions.slice(0, 6).map((q: any) => parseInt(q));
    const timerData = sheetData.timers || [];
    const highTimeQuestions = timerData
      .sort((a: any, b: any) => b.time - a.time)
      .slice(0, 4)
      .map((t: any) => parseInt(t.Qnumber));

    let recommendedQuestions = [];
    const solvedQuestions = sheetData.solvedquestions || [];
    
    for (const solvedQ of solvedQuestions.slice(0, 3)) {
      const qNum = parseInt(solvedQ);
      if (questionRecommendations[qNum]) {
        recommendedQuestions.push(...questionRecommendations[qNum].slice(0, 2));
      }
    }

    const allQuestions = [
      ...bookmarkedIds,
      ...highTimeQuestions,
      ...recommendedQuestions.slice(0, 2)
    ];

    const uniqueQuestions = [...new Set(allQuestions)].slice(0, 10);

    if (!user.progressTracker) {
      user.progressTracker = {
        weeklyTest: {
          sheetname: "striversheetdata",
          EasyQ: sheetData.EasyQ || 0,
          MedQ: sheetData.MedQ || 0,
          HardQ: sheetData.HardQ || 0,
          visitedDate: sheetData.visitedDate || [],
          solvedquestions: sheetData.solvedquestions || [],
          notequestions: sheetData.notequestions || [],
          bookmarkedquestions: sheetData.bookmarkedquestions || [],
          timers: sheetData.timers || [],
          isActive: true,
          weekStartDate: new Date(),
          testQuestions: uniqueQuestions,
          score: 0
        }
      };
    } else {
      user.progressTracker.weeklyTest = {
        ...user.progressTracker.weeklyTest,
        isActive: true,
        weekStartDate: new Date(),
        testQuestions: uniqueQuestions,
        score: 0,
        completedAt: undefined
      };
    }

    await user.save();
    console.log(` Weekly test generated for user: ${user.email}`);
    
  } catch (error) {
    console.error(` Error generating test for user ${userId}:`, error);
  }
};