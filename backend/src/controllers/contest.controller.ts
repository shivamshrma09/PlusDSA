import { Request, Response } from 'express';
import { ContestModel } from '../models/Contest.model';
import { UserModel } from '../models/User.model';

interface AuthRequest extends Request {
  userId?: string;
}


export const getAllContests = async (req: Request, res: Response): Promise<Response> => {
  try {
    const contests = await ContestModel.find({}).select('_id contestName company_Name role status createdAt');
    
    return res.status(200).json({
      success: true,
      totalContests: contests.length,
      contests: contests.map((c: any) => ({
        id: c._id,
        contestName: c.contestName,
        company_Name: c.company_Name,
        role: c.role,
        status: c.status,
        createdAt: c.createdAt
      }))
    });
    
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const createContest = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      contestName,
      company_Name,
      role,
      description,
      roundDetails
    } = req.body;

    if (!roundDetails || !Array.isArray(roundDetails)) {
      return res.status(400).json({
        success: false,
        error: 'roundDetails must be an array'
      });
    }

    const processedRoundDetails = roundDetails.map((round: any) => ({
      roundNumber: round.roundNumber || 0,
      roundName: round.roundName || 'Unknown Round',
      roundType: round.roundType || 'general',
      startDate: round.startTime ? new Date(round.startTime) : new Date(),
      endDate: round.endTime ? new Date(round.endTime) : new Date(),
      resultDate: round.resultTime ? new Date(round.resultTime) : new Date(),
      duration: round.duration ? round.duration.toString() : '0',
      totalQuestions: round.totalQuestions || 0,
      description: round.description || '',
      instructions: round.instructions || '',
      status: round.roundNumber === 0 ? 'live' : 'upcoming',
      type: 'online'
    }));

    const contest = await ContestModel.create({
      contestName,
      company_Name,
      role,
      description: description || '',
      roundDetails: processedRoundDetails,
      candidateDetails: [],
      roundData: [],
      rawData: [],
      status: 'active'
    });

    return res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      contestId: contest._id,
      contestName: contest.contestName,
      totalRounds: processedRoundDetails.length
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const getContestStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { contestID } = req.body;

    const contest = await ContestModel.findById(contestID);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }


    const candidate = contest.candidateDetails.find(
      (c: any) => c.candidateID.toString() === userId
    );


    const liveRound = contest.roundDetails.find((r: any) => r.status === 'live');
    
    if (!liveRound) {
      return res.status(200).json({
        success: true,
        action: 'WAIT',
        message: 'No active rounds'
      });
    }


    if (liveRound.roundNumber === 0) {
      if (!candidate) {
        return res.status(200).json({
          success: true,
          action: 'JOIN_CONTEST',
          contestName: contest.contestName,
          currentRound: {
            roundNumber: 0,
            roundName: 'Registration Round',
            status: 'live',
            endDate: liveRound.endDate
          }
        });
      } else {
        return res.status(200).json({
          success: true,
          action: 'ALREADY_REGISTERED',
          contestName: contest.contestName,
          message: 'You are already registered'
        });
      }
    }


    if (liveRound.roundNumber === 1) {
      if (!candidate) {
        return res.status(403).json({
          success: false,
          message: 'You are not registered for this contest'
        });
      }

      return res.status(200).json({
        success: true,
        action: 'START_CODING_ROUND',
        contestName: contest.contestName,
        currentRound: {
          roundNumber: 1,
          roundName: 'Coding Round',
          status: 'live',
          endDate: liveRound.endDate,
          duration: liveRound.duration
        }
      });
    }

    return res.status(200).json({
      success: true,
      action: 'WAIT',
      message: 'Contest completed'
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const joinContest = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { contestID } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const contest = await ContestModel.findById(contestID);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }


    const registrationRound = contest.roundDetails.find(r => r.roundNumber === 0 && r.status === 'live');
    if (!registrationRound) {
      return res.status(400).json({ 
        success: false, 
        message: 'Registration is not open' 
      });
    }


    const existingCandidate = contest.candidateDetails.find(
      (candidate: any) => candidate.candidateID.toString() === userId
    );
    
    if (existingCandidate) {
      return res.status(409).json({ 
        success: false, 
        message: 'Already registered' 
      });
    }


    contest.candidateDetails.push({
      candidateID: userId,
      candidateName: user.name,
      candidateEmail: user.email,
      dateOfEnrollment: new Date(),
      status: 'registered'
    });

    await contest.save();

    return res.status(201).json({
      success: true,
      message: 'Successfully registered for contest',
      contestName: contest.contestName
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const startCodingRound = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { contestID } = req.body;

    const contest = await ContestModel.findById(contestID);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }


    const codingRound = contest.roundDetails.find(r => r.roundNumber === 1 && r.status === 'live');
    if (!codingRound) {
      return res.status(400).json({ success: false, message: 'Coding round is not active' });
    }


    const candidate = contest.candidateDetails.find(
      (c: any) => c.candidateID.toString() === userId
    );
    
    if (!candidate) {
      return res.status(403).json({ success: false, message: 'Not registered for this contest' });
    }


    const rawDataEntry = contest.rawData.find((rd: any) => rd.roundNumber === 1);
    
    if (rawDataEntry && rawDataEntry.students) {
      const existingStudent = rawDataEntry.students.find((s: any) => 
        s.candidateID && s.candidateID.toString() === userId
      );
      
      if (existingStudent && existingStudent.questions && existingStudent.questions.length > 0) {
        return res.status(403).json({
          success: false,
          message: 'You have already taken this test',
          action: 'TEST_ALREADY_TAKEN'
        });
      }
    }


    const { codingQuestions } = await import('../data/codingQuestions');
    const shuffled = [...codingQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 3);

    return res.status(200).json({
      success: true,
      message: 'Coding round started',
      contestName: contest.contestName,
      roundInfo: {
        roundNumber: 1,
        roundName: 'Coding Round',
        duration: codingRound.duration,
        endDate: codingRound.endDate
      },
      questions: selectedQuestions,
      totalQuestions: 3
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const trackSuspiciousActivity = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { contestID, activity, timestamp } = req.body;

    const contest = await ContestModel.findById(contestID);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }


    const candidate = contest.candidateDetails.find(
      (c: any) => c.candidateID.toString() === userId
    );
    if (!candidate) {
      return res.status(403).json({ success: false, message: 'Not registered for this contest' });
    }


    let rawDataEntry = contest.rawData.find((rd: any) => rd.roundNumber === 1);
    if (!rawDataEntry) {
      rawDataEntry = {
        roundNumber: 1,
        roundName: 'Coding Round',
        students: []
      };
      contest.rawData.push(rawDataEntry);
    }


    let studentIndex = rawDataEntry.students.findIndex((s: any) => 
      s.candidateID && s.candidateID.toString() === userId
    );
    
    if (studentIndex === -1) {
      const newStudent = {
        candidateID: userId,
        candidateName: candidate.candidateName,
        candidateEmail: candidate.candidateEmail,
        questions: [],
        suspiciousActivity: []
      };
      rawDataEntry.students.push(newStudent);
      studentIndex = rawDataEntry.students.length - 1;
    }


    rawDataEntry.students[studentIndex].suspiciousActivity.push({
      title: activity,
      img: '',
      video: '',
      timestamp: new Date(timestamp)
    });

    await contest.save();

    return res.status(200).json({
      success: true,
      message: 'Activity tracked'
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const submitTest = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;
    const { contestID, questions } = req.body;

    const contest = await ContestModel.findById(contestID);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }


    const candidate = contest.candidateDetails.find(
      (c: any) => c.candidateID.toString() === userId
    );
    if (!candidate) {
      return res.status(403).json({ success: false, message: 'Not registered for this contest' });
    }


    let rawData = contest.rawData.find((rd: any) => rd.roundNumber === 1);
    if (!rawData) {
      rawData = {
        roundNumber: 1,
        roundName: 'Coding Round',
        students: []
      };
      contest.rawData.push(rawData);
    }

    
    const existingStudentIndex = rawData.students.findIndex((s: any) => 
      s.candidateID && s.candidateID.toString() === userId
    );
    
    if (existingStudentIndex !== -1 && rawData.students[existingStudentIndex].questions?.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Test already submitted'
      });
    }

    const studentData = {
      candidateID: userId,
      candidateName: candidate.candidateName,
      candidateEmail: candidate.candidateEmail,
      questions: questions.map((q: any) => ({
        question: q.question || q.title,
        answer: q.answer || q.userCode,
        timestamp: new Date()
      })),
      suspiciousActivity: rawData.students[existingStudentIndex]?.suspiciousActivity || []
    };


    if (existingStudentIndex !== -1) {
      rawData.students[existingStudentIndex] = studentData;
    } else {
      rawData.students.push(studentData);
    }

    await contest.save();

    return res.status(200).json({
      success: true,
      message: 'Test submitted successfully'
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};