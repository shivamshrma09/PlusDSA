const cron = require('node-cron');
const { striverA2ZAllSteps } = require('../data/striverA2ZAllSteps');
import { UserModel } from '../models/User.model';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendEmail(to: string, subject: string, html: string) {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@plusdsa.com',
      subject,
      html
    };
    
    await sgMail.send(msg);
    console.log(`Email sent successfully to: ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
  }
}
cron.schedule('0 9 * * *', async () => {
  
  try {
    const users = await UserModel.find({ 'profile.reminders_enabled': true });
    
    for (const user of users) {
      const target = user.profile?.[0]?.problems_per_day || 5;
      
      await sendEmail(user.email, 'Daily Coding Reminder', `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Good Morning, ${user.name}</h2>
          <p>Today's target: ${target} problems</p>
          <p>Start your coding journey now!</p>
        </div>
      `);
    }
  } catch (error) {
  }
});

cron.schedule('0 18 * * *', async () => {
  
  try {
    const users = await UserModel.find({ 'profile.reminders_enabled': true });
    
    for (const user of users) {
      const todayProgress = await getTodayProgress(user);
      const target = user.profile?.[0]?.problems_per_day || 5;
      const remaining = target - todayProgress.solved;
      
      if (remaining > 0) {
        await sendEmail(user.email, 'Evening Progress Check', `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Evening Check-in</h2>
            <p>Progress: ${todayProgress.solved}/${target} problems solved</p>
            <p>Remaining: ${remaining} problems</p>
            <p>Keep going, you can do it!</p>
          </div>
        `);
      }
    }
  } catch (error) {
  }
});


cron.schedule('0 23 * * *', async () => {
  
  try {
    const users = await UserModel.find({ 'profile.reminders_enabled': true });
    
    for (const user of users) {
      const todayProgress = await getTodayProgress(user);
      const target = user.profile?.[0]?.problems_per_day || 5;
      const remaining = target - todayProgress.solved;
      
      if (remaining > 0) {
        await sendEmail(user.email, 'Final Reminder', `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Final Reminder</h2>
            <p>Still need: ${remaining} problems</p>
            <p>Complete your daily goal before the day ends!</p>
          </div>
        `);
      }
    }
  } catch (error) {
  }
});


cron.schedule('0 0 * * *', async () => {
  
  try {
    const users = await UserModel.find({});
    
    for (const user of users) {
      const yesterdayProgress = await getDetailedYesterdayProgress(user);
      const target = user.profile?.[0]?.problems_per_day || 5;
      const percentage = Math.round((yesterdayProgress.solved / target) * 100);
      
      await sendEmail(user.email, `Daily Report - ${new Date().toLocaleDateString()}`, `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Daily Report</h2>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Overall Performance</h3>
            <p>Target Achievement: ${percentage}%</p>
            <p>Problems Solved: ${yesterdayProgress.solved}/${target}</p>
            <p>Total Time Spent: ${yesterdayProgress.timeSpent} minutes</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Difficulty Breakdown</h3>
            <p>Easy: ${yesterdayProgress.easy} problems</p>
            <p>Medium: ${yesterdayProgress.medium} problems</p>
            <p>Hard: ${yesterdayProgress.hard} problems</p>
          </div>
          
          ${yesterdayProgress.solvedQuestions.length > 0 ? `
          <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Questions Solved</h3>
            ${yesterdayProgress.solvedQuestions.map((q: any) => `
              <div style="margin: 10px 0; padding: 10px; border-left: 3px solid #007bff;">
                <strong>Q${q.questionNumber}</strong> - ${q.title || 'Question ' + q.questionNumber}<br>
                <small>Difficulty: ${q.difficulty} | Time: ${q.timeSpent} minutes</small>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          ${yesterdayProgress.bookmarked.length > 0 ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Bookmarked Questions</h3>
            <p>${yesterdayProgress.bookmarked.length} questions bookmarked for review</p>
          </div>
          ` : ''}
          
          ${yesterdayProgress.notes.length > 0 ? `
          <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Notes Added</h3>
            <p>${yesterdayProgress.notes.length} questions have notes</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background: ${yesterdayProgress.solved >= target ? '#d4edda' : '#f8d7da'}; border-radius: 5px;">
            ${yesterdayProgress.solved >= target ? 
              '<strong>Congratulations! Target achieved!</strong>' : 
              '<strong>Keep pushing! Tomorrow is a new opportunity.</strong>'
            }
          </div>
        </div>
      `);
      
      await updateUserStats(user, yesterdayProgress);
    }
  } catch (error) {
  }
});

async function getTodayProgress(user: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (!user.AllsheetData?.[0]) return { solved: 0, timeSpent: 0 };
  
  const sheet = user.AllsheetData[0];
  const todaySolved = sheet.solvedquestions.filter((q: any) => {
    const solvedDate = new Date(q.solvedAt);
    return solvedDate >= today && solvedDate < tomorrow;
  });
  
  let timeSpent = 0;
  todaySolved.forEach((q: any) => {
    const timer = sheet.timers.find((t: any) => t.Qnumber === q.questionNumber);
    if (timer) timeSpent += timer.time;
  });
  
  return {
    solved: todaySolved.length,
    timeSpent: Math.round(timeSpent / 60)
  };
}

async function getDetailedYesterdayProgress(user: any) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!user.AllsheetData?.[0]) return { 
    solved: 0, timeSpent: 0, easy: 0, medium: 0, hard: 0, 
    solvedQuestions: [], bookmarked: [], notes: [] 
  };
  
  const sheet = user.AllsheetData[0];
  const yesterdaySolved = sheet.solvedquestions.filter((q: any) => {
    const solvedDate = new Date(q.solvedAt);
    return solvedDate >= yesterday && solvedDate < today;
  });
  
  let timeSpent = 0, easy = 0, medium = 0, hard = 0;
  const solvedQuestions = [];
  
  for (const q of yesterdaySolved) {
    const timer = sheet.timers.find((t: any) => t.Qnumber === q.questionNumber);
    const questionTime = timer ? Math.round(timer.time / 60) : 0;
    timeSpent += questionTime;
    
    const difficulty = getDifficultyFromQuestion(q.questionNumber);
    if (difficulty === 'Easy') easy++;
    else if (difficulty === 'Medium') medium++;
    else if (difficulty === 'Hard') hard++;
    
    const questionData = getQuestionFromStriverData(q.questionNumber);
    solvedQuestions.push({
      questionNumber: q.questionNumber,
      title: questionData?.title || `Question ${q.questionNumber}`,
      difficulty,
      timeSpent: questionTime
    });
  }
  
  const bookmarked = sheet.bookmarkedquestions.filter((qNum: string) => 
    yesterdaySolved.some((q: any) => q.questionNumber === qNum)
  );
  
  const notes = sheet.notequestions.filter((note: any) => 
    yesterdaySolved.some((q: any) => q.questionNumber === note.Qnumber)
  );
  
  return {
    solved: yesterdaySolved.length,
    timeSpent,
    easy,
    medium,
    hard,
    solvedQuestions,
    bookmarked,
    notes
  };
}

function getDifficultyFromQuestion(questionNumber: string): string {
  try {
    for (const step of striverA2ZAllSteps) {
      if (step.sections) {
        for (const section of step.sections) {
          if (section.problems) {
            const problem = section.problems.find((p: any) => 
              p.id.toString() === questionNumber || p.id === parseInt(questionNumber)
            );
            if (problem) return problem.difficulty || 'Medium';
          }
        }
      }
    }
    return 'Medium';
  } catch (error) {
    return 'Medium';
  }
}

function getQuestionFromStriverData(questionNumber: string): any {
  try {
    for (const step of striverA2ZAllSteps) {
      if (step.sections) {
        for (const section of step.sections) {
          if (section.problems) {
            const problem = section.problems.find((p: any) => 
              p.id.toString() === questionNumber || p.id === parseInt(questionNumber)
            );
            if (problem) {
              return {
                title: problem.title,
                difficulty: problem.difficulty,
                topic: step.title,
                section: section.title
              };
            }
          }
        }
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}


async function updateUserStats(user: any, progress: any) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    if (!user.dailyStats) user.dailyStats = [];
    
    user.dailyStats = user.dailyStats.filter((stat: any) => stat.date !== today);
    
    user.dailyStats.push({
      date: today,
      solved: progress.solved,
      target: user.profile?.[0]?.problems_per_day || 5,
      timeSpent: progress.timeSpent,
      achieved: progress.solved >= (user.profile?.[0]?.problems_per_day || 5)
    });
    
    if (user.dailyStats.length > 30) {
      user.dailyStats = user.dailyStats.slice(-30);
    }
    
    await user.save();
  } catch (error) {
  }
}