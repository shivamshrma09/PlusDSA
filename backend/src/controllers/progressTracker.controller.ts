import { Request, Response } from 'express';
import { UserModel } from '../models/User.model';


const ensureSolvedQuestionsFormat = (solvedquestions: any): any[] => {
  if (!solvedquestions) return [];
  if (Array.isArray(solvedquestions)) {
    return solvedquestions.map(q => 
      typeof q === 'object' && q.questionNumber ? q : { questionNumber: String(q), solvedAt: new Date() }
    );
  }
  return [{ questionNumber: String(solvedquestions), solvedAt: new Date() }];
};


export const getWeeklyTestData = async (req: any, res: Response): Promise<Response> => {
  try {
    const { WeeklytestName } = req.params;
    const userId = req.userId;
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(404).json({ success: false, message: 'No progress tracker found' });
    }
    
    const progressTracker = user.progressTracker[0];
    const weeklyTest = progressTracker.weeklyTest.find((wt: any) => wt.WeeklytestName === WeeklytestName);
    
    if (!weeklyTest) {
      return res.status(404).json({ success: false, message: 'Weekly test not found' });
    }
    
    return res.status(200).json({ success: true, data: weeklyTest });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch weekly test data' });
  }
};

export const getAllWeeklyTests = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(404).json({ success: false, message: 'No progress tracker found' });
    }
    
    const progressTracker = user.progressTracker[0];
    const weeklyTests = progressTracker.weeklyTest || [];
    
    return res.status(200).json({ success: true, data: weeklyTests });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch weekly tests' });
  }
};

export const letestWtdata = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(404).json({ success: false, message: 'No progress tracker found' });
    }
    
    const progressTracker = user.progressTracker[0];
    if (!progressTracker.weeklyTest || progressTracker.weeklyTest.length === 0) {
      return res.status(404).json({ success: false, message: 'No weekly tests found' });
    }
    
    const latestWeeklyTest = progressTracker.weeklyTest.sort((a: any, b: any) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )[0];
    
    return res.status(200).json({ success: true, data: latestWeeklyTest });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch latest weekly test data' });
  }
};

export const addQuestionWT = async (req: any, res: Response): Promise<Response> => {
  try {
    const { WeeklytestName, questionNumber, difficulty } = req.body;
    const userId = req.userId;
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    let weeklyTest = progressTracker.weeklyTest.find((wt: any) => wt.WeeklytestName === WeeklytestName);
    
    if (!weeklyTest) {
      weeklyTest = {
        WeeklytestName,
        EasyQ: 0,
        MedQ: 0,
        HardQ: 0,
        visitedDate: [],
        solvedquestions: [],
        notequestions: [],
        bookmarkedquestions: [],
        timers: [],
        isActive: true,
        testQuestions: [],
        score: 0,
        createdAt: new Date()
      };
      progressTracker.weeklyTest.push(weeklyTest);
    }

    weeklyTest.solvedquestions = ensureSolvedQuestionsFormat(weeklyTest.solvedquestions);
    const questionIndex = weeklyTest.solvedquestions.findIndex((q: any) => q.questionNumber === questionNumber);
    
    if (questionIndex !== -1) {
      weeklyTest.solvedquestions.splice(questionIndex, 1);
      if (difficulty === 'Easy') weeklyTest.EasyQ = Math.max(0, (weeklyTest.EasyQ || 0) - 1);
      else if (difficulty === 'Medium') weeklyTest.MedQ = Math.max(0, (weeklyTest.MedQ || 0) - 1);
      else if (difficulty === 'Hard') weeklyTest.HardQ = Math.max(0, (weeklyTest.HardQ || 0) - 1);
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question removed successfully', action: 'removed' });
    } else {
      weeklyTest.solvedquestions.push({ questionNumber, solvedAt: new Date() });
      if (difficulty === 'Easy') weeklyTest.EasyQ = (weeklyTest.EasyQ || 0) + 1;
      else if (difficulty === 'Medium') weeklyTest.MedQ = (weeklyTest.MedQ || 0) + 1;
      else if (difficulty === 'Hard') weeklyTest.HardQ = (weeklyTest.HardQ || 0) + 1;
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question added successfully', action: 'added' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle question' });
  }
};

export const addNoteWT = async (req: any, res: Response): Promise<Response> => {
  try {
    const { WeeklytestName, questionNumber, noteText } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    const weeklyTest = progressTracker.weeklyTest.find((wt: any) => wt.WeeklytestName === WeeklytestName);
    if (!weeklyTest) return res.status(404).json({ success: false, message: 'Weekly test not found' });

    const existingNoteIndex = weeklyTest.notequestions.findIndex((n: any) => n.Qnumber === questionNumber);
    if (existingNoteIndex !== -1) {
      weeklyTest.notequestions[existingNoteIndex].noteText = noteText;
    } else {
      weeklyTest.notequestions.push({ Qnumber: questionNumber, noteText });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add/update note' });
  }
};

export const addBookmarkWT = async (req: any, res: Response): Promise<Response> => {
  try {
    const { WeeklytestName, questionNumber } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    const weeklyTest = progressTracker.weeklyTest.find((wt: any) => wt.WeeklytestName === WeeklytestName);
    if (!weeklyTest) return res.status(404).json({ success: false, message: 'Weekly test not found' });

    if (!weeklyTest.bookmarkedquestions.includes(questionNumber)) {
      weeklyTest.bookmarkedquestions.push(questionNumber);
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Question bookmarked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to bookmark question' });
  }
};

export const addTimerWT = async (req: any, res: Response): Promise<Response> => {
  try {
    const { WeeklytestName, questionNumber, time } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    const weeklyTest = progressTracker.weeklyTest.find((wt: any) => wt.WeeklytestName === WeeklytestName);
    if (!weeklyTest) return res.status(404).json({ success: false, message: 'Weekly test not found' });

    const existingTimerIndex = weeklyTest.timers.findIndex((t: any) => t.Qnumber === questionNumber);
    if (existingTimerIndex !== -1) {
      weeklyTest.timers[existingTimerIndex].time = time;
    } else {
      weeklyTest.timers.push({ Qnumber: questionNumber, time });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Timer updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update timer' });
  }
};

export const latestSRdata = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(404).json({ success: false, message: 'No progress tracker found' });
    }
    
    const progressTracker = user.progressTracker[0];
    if (!progressTracker.SpaceRepetition || progressTracker.SpaceRepetition.length === 0) {
      return res.status(404).json({ success: false, message: 'No space repetitions found' });
    }
    
    const latestSpaceRepetition = progressTracker.SpaceRepetition.sort((a: any, b: any) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    )[0];
    
    return res.status(200).json({ success: true, data: latestSpaceRepetition });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch latest space repetition data' });
  }
};

export const getSpaceRepetitionData = async (req: any, res: Response): Promise<Response> => {
  try {
    const { SpaceRepetitionName } = req.params;
    const userId = req.userId;
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(404).json({ success: false, message: 'No progress tracker found' });
    }
    
    const progressTracker = user.progressTracker[0];
    const spaceRepetition = progressTracker.SpaceRepetition.find((sr: any) => sr.SpaceRepetitionName === SpaceRepetitionName);
    
    if (!spaceRepetition) {
      return res.status(404).json({ success: false, message: 'Space repetition not found' });
    }
    
    return res.status(200).json({ success: true, data: spaceRepetition });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch space repetition data' });
  }
};

export const getAllSpaceRepetitions = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(404).json({ success: false, message: 'No progress tracker found' });
    }
    
    const progressTracker = user.progressTracker[0];
    const spaceRepetitions = progressTracker.SpaceRepetition || [];
    
    return res.status(200).json({ success: true, data: spaceRepetitions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch space repetitions' });
  }
};

export const addQuestionSR = async (req: any, res: Response): Promise<Response> => {
  try {
    const { SpaceRepetitionName, questionNumber, difficulty } = req.body;
    const userId = req.userId;
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    let spaceRepetition = progressTracker.SpaceRepetition.find((sr: any) => sr.SpaceRepetitionName === SpaceRepetitionName);
    
    if (!spaceRepetition) {
      spaceRepetition = {
        SpaceRepetitionName,
        EasyQ: 0,
        MedQ: 0,
        HardQ: 0,
        visitedDate: [],
        solvedquestions: [],
        notequestions: [],
        bookmarkedquestions: [],
        timers: [],
        isActive: true,
        testQuestions: [],
        score: 0,
        createdAt: new Date()
      };
      progressTracker.SpaceRepetition.push(spaceRepetition);
    }

    spaceRepetition.solvedquestions = ensureSolvedQuestionsFormat(spaceRepetition.solvedquestions);
    const questionIndex = spaceRepetition.solvedquestions.findIndex((q: any) => q.questionNumber === questionNumber);
    
    if (questionIndex !== -1) {
      spaceRepetition.solvedquestions.splice(questionIndex, 1);
      if (difficulty === 'Easy') spaceRepetition.EasyQ = Math.max(0, (spaceRepetition.EasyQ || 0) - 1);
      else if (difficulty === 'Medium') spaceRepetition.MedQ = Math.max(0, (spaceRepetition.MedQ || 0) - 1);
      else if (difficulty === 'Hard') spaceRepetition.HardQ = Math.max(0, (spaceRepetition.HardQ || 0) - 1);
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question removed successfully', action: 'removed' });
    } else {
      spaceRepetition.solvedquestions.push({ questionNumber, solvedAt: new Date() });
      if (difficulty === 'Easy') spaceRepetition.EasyQ = (spaceRepetition.EasyQ || 0) + 1;
      else if (difficulty === 'Medium') spaceRepetition.MedQ = (spaceRepetition.MedQ || 0) + 1;
      else if (difficulty === 'Hard') spaceRepetition.HardQ = (spaceRepetition.HardQ || 0) + 1;
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question added successfully', action: 'added' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle question' });
  }
};

export const addNoteSR = async (req: any, res: Response): Promise<Response> => {
  try {
    const { SpaceRepetitionName, questionNumber, noteText } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    const spaceRepetition = progressTracker.SpaceRepetition.find((sr: any) => sr.SpaceRepetitionName === SpaceRepetitionName);
    if (!spaceRepetition) return res.status(404).json({ success: false, message: 'Space repetition not found' });

    const existingNoteIndex = spaceRepetition.notequestions.findIndex((n: any) => n.Qnumber === questionNumber);
    if (existingNoteIndex !== -1) {
      spaceRepetition.notequestions[existingNoteIndex].noteText = noteText;
    } else {
      spaceRepetition.notequestions.push({ Qnumber: questionNumber, noteText });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add/update note' });
  }
};

export const addBookmarkSR = async (req: any, res: Response): Promise<Response> => {
  try {
    const { SpaceRepetitionName, questionNumber } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    const spaceRepetition = progressTracker.SpaceRepetition.find((sr: any) => sr.SpaceRepetitionName === SpaceRepetitionName);
    if (!spaceRepetition) return res.status(404).json({ success: false, message: 'Space repetition not found' });

    if (!spaceRepetition.bookmarkedquestions.includes(questionNumber)) {
      spaceRepetition.bookmarkedquestions.push(questionNumber);
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Question bookmarked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to bookmark question' });
  }
};

export const addTimerSR = async (req: any, res: Response): Promise<Response> => {
  try {
    const { SpaceRepetitionName, questionNumber, time } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.progressTracker || user.progressTracker.length === 0) {
      user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
    }

    const progressTracker = user.progressTracker[0];
    const spaceRepetition = progressTracker.SpaceRepetition.find((sr: any) => sr.SpaceRepetitionName === SpaceRepetitionName);
    if (!spaceRepetition) return res.status(404).json({ success: false, message: 'Space repetition not found' });

    const existingTimerIndex = spaceRepetition.timers.findIndex((t: any) => t.Qnumber === questionNumber);
    if (existingTimerIndex !== -1) {
      spaceRepetition.timers[existingTimerIndex].time = time;
    } else {
      spaceRepetition.timers.push({ Qnumber: questionNumber, time });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Timer updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update timer' });
  }
};


export const addQuestionSheet = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber, difficulty } = req.body;
    const userId = req.userId;
    
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    if (!user.AllsheetData || user.AllsheetData.length === 0) {
      user.AllsheetData = [{
        sheetname: "striversheetdata",
        EasyQ: 0,
        MedQ: 0,
        HardQ: 0,
        visitedDate: [],
        solvedquestions: [],
        notequestions: [],
        bookmarkedquestions: [],
        timers: []
      }];
    }

    let sheet = user.AllsheetData.find((s: any) => s.sheetname === sheetname);
    
    if (!sheet) {
      sheet = {
        sheetname,
        EasyQ: 0,
        MedQ: 0,
        HardQ: 0,
        visitedDate: [],
        solvedquestions: [],
        notequestions: [],
        bookmarkedquestions: [],
        timers: []
      };
      user.AllsheetData.push(sheet);
    }

    sheet.solvedquestions = ensureSolvedQuestionsFormat(sheet.solvedquestions);
    const questionIndex = sheet.solvedquestions.findIndex((q: any) => q.questionNumber === questionNumber);
    
    if (questionIndex !== -1) {
      sheet.solvedquestions.splice(questionIndex, 1);
      if (difficulty === 'Easy') sheet.EasyQ = Math.max(0, (sheet.EasyQ || 0) - 1);
      else if (difficulty === 'Medium') sheet.MedQ = Math.max(0, (sheet.MedQ || 0) - 1);
      else if (difficulty === 'Hard') sheet.HardQ = Math.max(0, (sheet.HardQ || 0) - 1);
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question removed successfully', action: 'removed' });
    } else {
      sheet.solvedquestions.push({ questionNumber, solvedAt: new Date() });
      if (difficulty === 'Easy') sheet.EasyQ = (sheet.EasyQ || 0) + 1;
      else if (difficulty === 'Medium') sheet.MedQ = (sheet.MedQ || 0) + 1;
      else if (difficulty === 'Hard') sheet.HardQ = (sheet.HardQ || 0) + 1;
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question added successfully', action: 'added' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle question' });
  }
};

export const addNoteSheet = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber, noteText } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const sheet = user.AllsheetData?.find((s: any) => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    const existingNoteIndex = sheet.notequestions.findIndex((n: any) => n.Qnumber === questionNumber);
    if (existingNoteIndex !== -1) {
      sheet.notequestions[existingNoteIndex].noteText = noteText;
    } else {
      sheet.notequestions.push({ Qnumber: questionNumber, noteText });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Note updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add/update note' });
  }
};

export const addBookmarkSheet = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const sheet = user.AllsheetData?.find((s: any) => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    if (!sheet.bookmarkedquestions.includes(questionNumber)) {
      sheet.bookmarkedquestions.push(questionNumber);
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Question bookmarked successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to bookmark question' });
  }
};

export const addTimerSheet = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber, time } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const sheet = user.AllsheetData?.find((s: any) => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    const existingTimerIndex = sheet.timers.findIndex((t: any) => t.Qnumber === questionNumber);
    if (existingTimerIndex !== -1) {
      sheet.timers[existingTimerIndex].time = time;
    } else {
      sheet.timers.push({ Qnumber: questionNumber, time });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Timer updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update timer' });
  }
};