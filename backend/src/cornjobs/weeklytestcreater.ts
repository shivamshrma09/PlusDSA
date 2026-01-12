const cron = require('node-cron'); 
import { UserModel } from '../models/User.model';
const { striverA2ZAllSteps } = require('../data/striverA2ZAllSteps');


cron.schedule('0 */2 * * *', async () => {
   
  try {
    const users = await UserModel.find({});
    
    for (const user of users) {
      if (!user.AllsheetData || user.AllsheetData.length === 0) continue;
      if (!user.progressTracker || user.progressTracker.length === 0) {
        user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
      }
      
      const currentTime = new Date();
      const twoHoursAgo = new Date(currentTime.getTime() - (2 * 60 * 60 * 1000));
      const sheet = user.AllsheetData[0];
      const progressTracker = user.progressTracker[0];
      

      const recentSolvedQuestions = sheet.solvedquestions.filter((q: any) => {
        const solvedDate = new Date(q.solvedAt);
        return solvedDate >= twoHoursAgo && solvedDate <= currentTime;
      });
      
      if (recentSolvedQuestions.length === 0) continue;
      
      const weakQuestions = [];
      
      
      for (const solvedQ of recentSolvedQuestions) {
        const questionNumber = solvedQ.questionNumber;
        

        const timer = sheet.timers.find((t: any) => t.Qnumber === questionNumber);
        const isHighTime = timer && timer.time > 900;
        
        

        const isBookmarked = sheet.bookmarkedquestions.includes(questionNumber);
                const hasNotes = sheet.notequestions.some((n: any) => n.Qnumber === questionNumber);
        

                if (isHighTime || isBookmarked || hasNotes) {

                  const questionData = getQuestionFromStriverData(questionNumber);
          
          if (questionData) {
            weakQuestions.push({
              questionNumber,
              difficulty: questionData.difficulty || 'Medium',
              topic: questionData.topic || 'Unknown',
              section: questionData.section || 'Unknown',
              stepId: questionData.stepId || 0,
              title: questionData.title || `Question ${questionNumber}`,
              practice: questionData.practice || '',
              gfgArticle: questionData.gfgArticle || '',
              video: questionData.video || '',
              timeSpent: timer?.time || 0,
              isBookmarked,
              hasNotes,
              identifiedAt: currentTime
            });
          }
        }
      }
      

      if (weakQuestions.length > 0) {
        for (const weakQ of weakQuestions) {
          const existingWeak = progressTracker.weekareas.find(
            (w: any) => w.questionNumber === weakQ.questionNumber
          );
          
          if (!existingWeak) {
            progressTracker.weekareas.push({
              questionNumber: weakQ.questionNumber,
              difficulty: weakQ.difficulty,
              topic: weakQ.topic,
              section: weakQ.section,
              stepId: weakQ.stepId,
              title: weakQ.title,
              practice: weakQ.practice,
              gfgArticle: weakQ.gfgArticle,
              video: weakQ.video
            });
          }
        }
        
        await user.save();
      }
    }
  } catch (error) {
    console.error('Error tracking weak areas:', error);
  }
});


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
                topic: step.title || 'General',           
                section: section.title || 'Unknown',     
                stepId: step.id,
                practice: problem.practice || '',         
                gfgArticle: problem.gfgArticle || '',     
                video: problem.video || ''                
              };
            }
          }
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting question from striver data:', error);
    return null;
  }
}


cron.schedule('0 23 * * *', async () => {
   
  try {
    const users = await UserModel.find({});
    
    for (const user of users) {
      if (!user.AllsheetData || user.AllsheetData.length === 0) continue;
      if (!user.progressTracker || user.progressTracker.length === 0) {
        user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
      }
      
      const currentDate = new Date();
      const sheet = user.AllsheetData[0];
      const progressTracker = user.progressTracker[0];
      

      const intervals = [1, 3, 7, 14, 30];
      const questionsForReview = [];
      

      for (const solvedQ of sheet.solvedquestions) {
        const solvedDate = new Date(solvedQ.solvedAt);
        const daysSinceSolved = Math.floor((currentDate.getTime() - solvedDate.getTime()) / (24 * 60 * 60 * 1000));
        

        const reviewHistory = getQuestionReviewHistory(progressTracker.SpaceRepetition, solvedQ.questionNumber);
        const nextReviewDate = calculateNextReviewDate(solvedDate, reviewHistory);
        
        if (currentDate >= nextReviewDate) {
          questionsForReview.push({
            ...solvedQ,
            daysSinceSolved,
            reviewCount: reviewHistory.length,
            lastPerformance: getLastPerformance(reviewHistory),
            priority: getPriority(daysSinceSolved, sheet, solvedQ.questionNumber, reviewHistory)
          });
        }
      }
      
      if (questionsForReview.length === 0) continue;
      

      questionsForReview.sort((a, b) => b.priority - a.priority);
      

      const srName = `SR-${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      

      const existingSR = progressTracker.SpaceRepetition.find((sr: any) => sr.SpaceRepetitionName === srName);
      
      if (!existingSR && questionsForReview.length > 0) {

        const selectedQuestions: any[] = questionsForReview.slice(0, 15);
        
        progressTracker.SpaceRepetition.push({
          SpaceRepetitionName: srName,
          EasyQ: 0,
          MedQ: 0,
          HardQ: 0,
          visitedDate: [],
          solvedquestions: [],
          notequestions: [],
          bookmarkedquestions: [],
          timers: [],
          isActive: true,
          weekStartDate: new Date(),
          testQuestions: selectedQuestions.map((q: any) => q.questionNumber),
          score: 0,
          createdAt: new Date()
        });
        
        await user.save();
      }
    }
  } catch (error) {
    console.error('Error creating space repetition:', error);
  }
});


function getQuestionReviewHistory(spaceRepetitions: any[], questionNumber: string): any[] {
  const history = [];
  
  for (const sr of spaceRepetitions) {
    const questionInSR = sr.solvedquestions.find((q: any) => q.questionNumber === questionNumber);
    if (questionInSR) {

      const timer = sr.timers.find((t: any) => t.Qnumber === questionNumber);
      const performance = calculatePerformance(timer?.time || 0);
      
      history.push({
        date: questionInSR.solvedAt || sr.createdAt,
        performance: performance 
      });
    }
  }
  
  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}


function calculatePerformance(timeInSeconds: number): number {
  if (timeInSeconds === 0) return 0.5; 
  

  if (timeInSeconds <= 300) return 1.0;    
  if (timeInSeconds <= 600) return 0.8;      
  if (timeInSeconds <= 1200) return 0.6;   
  if (timeInSeconds <= 1800) return 0.4;   
  return 0.2;                                
}


function calculateNextReviewDate(initialDate: Date, reviewHistory: any[]): Date {
  if (reviewHistory.length === 0) {

    return new Date(initialDate.getTime() + (1 * 24 * 60 * 60 * 1000));
  }
  
  const lastReview = reviewHistory[reviewHistory.length - 1];
  const lastReviewDate = new Date(lastReview.date);

  
  let interval = 1;
  let easeFactor = 2.5;
  
  for (let i = 0; i < reviewHistory.length; i++) {
    const performance = reviewHistory[i].performance;
    const quality = Math.round(performance * 5); 
    
    if (quality < 3) {

      interval = 1;
    } else {
      if (i === 0) {
        interval = 1;
      } else if (i === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }
    

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  }
  
  return new Date(lastReviewDate.getTime() + (interval * 24 * 60 * 60 * 1000));
}


function getLastPerformance(reviewHistory: any[]): number {
  if (reviewHistory.length === 0) return 0.5;
  return reviewHistory[reviewHistory.length - 1].performance;
}


cron.schedule('0 0 * * 0', async () => {
   
  try {
    const users = await UserModel.find({});
    
    for (const user of users) {
      if (!user.AllsheetData || user.AllsheetData.length === 0) continue;
      if (!user.progressTracker || user.progressTracker.length === 0) {
        user.progressTracker = [{ weeklyTest: [], SpaceRepetition: [], weekareas: [] }];
      }
      
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
      const currentWeek = `Week-${getWeekNumber(currentDate)}-${currentDate.getFullYear()}`;
      

      const recentQuestions = user.AllsheetData[0].solvedquestions.filter((q: any) => {
        const solvedDate = new Date(q.solvedAt);
        return solvedDate >= sevenDaysAgo && solvedDate <= currentDate;
      });
      
      if (recentQuestions.length === 0) continue;
      
      const progressTracker = user.progressTracker[0];
      

      const existingTest = progressTracker.weeklyTest.find((wt: any) => wt.WeeklytestName === currentWeek);
      
      if (!existingTest) {

        const sheet = user.AllsheetData[0];
        

        const questionsWithTime = recentQuestions.filter((q: any) => {
          const timer = sheet.timers.find((t: any) => t.Qnumber === q.questionNumber);
          return timer && timer.time > 600; 
        }).sort((a: any, b: any) => {
          const timerA = sheet.timers.find((t: any) => t.Qnumber === a.questionNumber);
          const timerB = sheet.timers.find((t: any) => t.Qnumber === b.questionNumber);
          return (timerB?.time || 0) - (timerA?.time || 0);
        });
        

        const bookmarkedQuestions = recentQuestions.filter((q: any) => 
          sheet.bookmarkedquestions.includes(q.questionNumber)
        );
        

        const questionsWithNotes = recentQuestions.filter((q: any) => 
          sheet.notequestions.some((n: any) => n.Qnumber === q.questionNumber)
        );
        

        const selectedQuestions: any[] = [];
        

        const highTimeQuestions = questionsWithTime.slice(0, 5);
        selectedQuestions.push(...highTimeQuestions);
        

        const uniqueBookmarked = bookmarkedQuestions.filter((q: any) => 
          !selectedQuestions.some((sq: any) => sq.questionNumber === q.questionNumber)
        ).slice(0, 3);
        selectedQuestions.push(...uniqueBookmarked);
        

        const uniqueNoted = questionsWithNotes.filter((q: any) => 
          !selectedQuestions.some((sq: any) => sq.questionNumber === q.questionNumber)
        ).slice(0, 2);
        selectedQuestions.push(...uniqueNoted);
        

        if (selectedQuestions.length < 10) {
          const remainingQuestions = recentQuestions.filter((q: any) => 
            !selectedQuestions.some((sq: any) => sq.questionNumber === q.questionNumber)
          );
          const shuffledRemaining = remainingQuestions.sort(() => 0.5 - Math.random());
          const needed = 10 - selectedQuestions.length;
          selectedQuestions.push(...shuffledRemaining.slice(0, needed));
        }
        

        const finalQuestions = selectedQuestions.slice(0, 10);
        
        progressTracker.weeklyTest.push({
          WeeklytestName: currentWeek,
          EasyQ: 0,
          MedQ: 0,
          HardQ: 0,
          visitedDate: [],
          solvedquestions: [],
          notequestions: [],
          bookmarkedquestions: [],
          timers: [],
          isActive: true,
          weekStartDate: new Date(),
          testQuestions: finalQuestions.map((q: any) => q.questionNumber),
          score: 0,
          createdAt: new Date()
        });
        
        await user.save();
        console.log(`Weekly test created for user: ${user.name} with ${finalQuestions.length} questions (${highTimeQuestions.length} high-time, ${uniqueBookmarked.length} bookmarked, ${uniqueNoted.length} with notes)`);
      }
    }
  } catch (error) {
    console.error('Error creating weekly tests:', error);
  }
});


function getWeekNumber(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}


function getPriority(daysSinceSolved: number, sheet: any, questionNumber: string, reviewHistory: any[]): number {
  let priority = 0;
  

  priority += Math.min(daysSinceSolved, 100);
  

  const lastPerformance = getLastPerformance(reviewHistory);
  if (lastPerformance < 0.3) priority += 50;      
  else if (lastPerformance < 0.5) priority += 30;
  else if (lastPerformance < 0.7) priority += 10; 
  

  priority += reviewHistory.length * 5;
  

  if (sheet.bookmarkedquestions.includes(questionNumber)) {
    priority += 25;
  }
  

  if (sheet.notequestions.some((n: any) => n.Qnumber === questionNumber)) {
    priority += 20;
  }
  

  const timer = sheet.timers.find((t: any) => t.Qnumber === questionNumber);
  if (timer && timer.time > 1800) { 
    priority += 30;
  } else if (timer && timer.time > 600) { 
    priority += 15;
  }
  
  return priority;
}
