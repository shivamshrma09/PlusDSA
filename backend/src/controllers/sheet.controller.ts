import { Request, Response } from 'express';
import { UserModel } from '../models/User.model';
import { sendEmail } from '../services/sendemail.services';

export const addQuestion = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber, difficulty, Testdata } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (Testdata && Array.isArray(Testdata) && Testdata.length > 0) {
      const correctAnswers = Testdata.filter(q => q.isCorrect).length;
      const totalQuestions = Testdata.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      
      const emailHtml = `
        <div style="max-width: 500px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff;">
          <div style="background: #0340aa; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Test Results</h1>
            <div style="background: rgba(255,255,255,0.15); margin: 20px 0 0 0; padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);">
              <div style="font-size: 32px; font-weight: bold; color: white;">${score}%</div>
              <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-top: 5px;">${correctAnswers} of ${totalQuestions} correct</div>
            </div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
              <h3 style="margin: 0 0 15px 0; color: #000000; font-size: 16px; font-weight: 600;">Question Summary</h3>
              ${Testdata.map((q, index) => `
                <div style="display: flex; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <div style="width: 20px; height: 20px; border-radius: 50%; background: ${q.isCorrect ? '#0340aa' : '#000000'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-right: 12px; flex-shrink: 0; margin-top: 2px;">
                    ${q.isCorrect ? '✓' : '✗'}
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="color: #000000; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Q${q.questionNumber}: ${q.questionTitle || 'Question ' + q.questionNumber}</div>
                    <div style="color: #666666; font-size: 12px;">Difficulty: ${q.difficulty}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
              <div style="color: #000000; font-size: 14px;">Keep practicing! 💪</div>
            </div>
          </div>
        </div>
      `;
      
      const emailSubject = `📊 PlusDSA Test Report - Score: ${score}%`;
      let emailSent = false;
      try {
        await sendEmail(
          user.email,
          emailSubject,
          emailHtml
        );
        emailSent = true;
      } catch (emailError) {
        console.error('Failed to send test report email:', emailError);
      }
      const testDataEntry = {
        sheetname,
        questontitle: Testdata[0]?.questionTitle || '',
        QuestionNumber: questionNumber.toString(),
        Difficulty: difficulty,
        Topic: sheetname,
        correctQuestion: correctAnswers.toString(),
        isEmailsend: emailSent ? 'true' : 'false',
        Emailcontent: emailHtml,
        Emailsubject: emailSubject,
        Emailsendtime: emailSent ? new Date() : null,
        testdata: JSON.stringify(Testdata)
      };
      user.Testdata.push(testDataEntry);
      Testdata.forEach((q: any) => {
        if (q.isCorrect) {
          user.points = (user.points || 0) + 4;
        } else {
          user.points = Math.max((user.points || 0) - 1, 0);
        }
      });
    }

    let sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) {
      user.AllsheetData.push({ sheetname, EasyQ: 0, MedQ: 0, HardQ: 0, visitedDate: [], solvedquestions: [], notequestions: [], bookmarkedquestions: [], timers: [] });
      sheet = user.AllsheetData[user.AllsheetData.length - 1];
    }



    
    const questionIndex = sheet.solvedquestions.findIndex((q: any) => q.questionNumber === questionNumber);
    
    if (questionIndex !== -1) {
      sheet.solvedquestions.splice(questionIndex, 1);
      if (difficulty === 'Easy') sheet.EasyQ--;
      else if (difficulty === 'Medium') sheet.MedQ--;
      else if (difficulty === 'Hard') sheet.HardQ--;
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question removed successfully', action: 'removed' });
    } else {
      sheet.solvedquestions.push({ questionNumber, solvedAt: new Date() });
      if (difficulty === 'Easy') sheet.EasyQ++;
      else if (difficulty === 'Medium') sheet.MedQ++;
      else if (difficulty === 'Hard') sheet.HardQ++;
      
      await user.save();
      return res.status(200).json({ success: true, message: 'Question added successfully', action: 'added' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to toggle question' });
  }
};

export const addNote = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber, noteText } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    const existingNote = sheet.notequestions.find((n: any) => n.Qnumber === questionNumber);
    if (existingNote) {
      existingNote.noteText = noteText;
    } else {
      sheet.notequestions.push({ Qnumber: questionNumber, noteText });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Note added successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add note' });
  }
};

export const addBookmark = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
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

export const addTimer = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname, questionNumber, time } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    const existingTimer = sheet.timers.find((t: any) => t.Qnumber === questionNumber);
    if (existingTimer) {
      existingTimer.time = time;
    } else {
      sheet.timers.push({ Qnumber: questionNumber, time });
    }

    await user.save();
    return res.status(200).json({ success: true, message: 'Timer added successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add timer' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<Response> => {
  try {
    const topUsers = await UserModel.find({})
      .select('name points')
      .sort({ points: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      leaderboard: topUsers.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        points: user.points || 0
      }))
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get leaderboard' });
  }
};

export const getSheetData = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    return res.status(200).json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        sheet: {
          sheetname: sheet.sheetname,
          EasyQ: sheet.EasyQ,
          MedQ: sheet.MedQ,
          HardQ: sheet.HardQ,
          visitedDate: sheet.visitedDate,
          solvedquestions: sheet.solvedquestions,
          notequestions: sheet.notequestions,
          bookmarkedquestions: sheet.bookmarkedquestions,
          timers: sheet.timers
        },
        playlists: user.playlists
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get sheet data' });
  }
};

export const getAllSheets = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, data: user.AllsheetData });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get sheets data' });
  }
};

export const getSolvedQuestions = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    return res.status(200).json({ success: true, data: sheet.solvedquestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get solved questions' });
  }
};

export const getNotes = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    return res.status(200).json({ success: true, data: sheet.notequestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get notes' });
  }
};

export const getBookmarks = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    return res.status(200).json({ success: true, data: sheet.bookmarkedquestions });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get bookmarks' });
  }
};

export const getTimers = async (req: any, res: Response): Promise<Response> => {
  try {
    const { sheetname } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const sheet = user.AllsheetData.find(s => s.sheetname === sheetname);
    if (!sheet) return res.status(404).json({ success: false, message: 'Sheet not found' });

    return res.status(200).json({ success: true, data: sheet.timers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get timers' });
  }
};

export const createPlaylist = async (req: any, res: Response): Promise<Response> => {
  try {
    const { playlistName, description, isPublic } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const playlistId = `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newPlaylist = {
      playlistId,
      playlistName,
      description: description || '',
      questions: [],
      isPublic: isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    user.playlists.push(newPlaylist);
    await user.save();

    return res.status(201).json({ 
      success: true, 
      message: 'Playlist created successfully',
      playlist: newPlaylist
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create playlist' });
  }
};

export const addQuestionToPlaylist = async (req: any, res: Response): Promise<Response> => {
  try {
    const { playlistId, sheetname, questionNumber, difficulty } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const playlist = user.playlists.find(p => p.playlistId === playlistId);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    const questionExists = playlist.questions.find((q: any) => 
      q.sheetname === sheetname && q.questionNumber === questionNumber
    );

    if (questionExists) {
      return res.status(400).json({ success: false, message: 'Question already exists in playlist' });
    }

    playlist.questions.push({
      sheetname,
      questionNumber,
      difficulty,
      addedAt: new Date()
    });

    playlist.updatedAt = new Date();
    await user.save();

    return res.status(200).json({ success: true, message: 'Question added to playlist successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add question to playlist' });
  }
};

export const getAllPlaylists = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ 
      success: true, 
      data: user.playlists
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get playlists' });
  }
};

export const getPlaylistById = async (req: any, res: Response): Promise<Response> => {
  try {
    const { playlistId } = req.params;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const playlist = user.playlists.find(p => p.playlistId === playlistId);
    if (!playlist) return res.status(404).json({ success: false, message: 'Playlist not found' });

    return res.status(200).json({ 
      success: true, 
      data: playlist
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get playlist' });
  }
};