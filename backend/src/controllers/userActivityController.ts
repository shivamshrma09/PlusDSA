import { Response, Request } from 'express';
import { AuthRequest } from '../middleware/cookie-auth.middleware';
import UserActivity from '../models/UserActivity';


const getISTDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; 
  const istTime = new Date(now.getTime() + istOffset);
  return istTime.toISOString().split('T')[0]; 
};

const getISTDateTime = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffset);
};

export const trackUserVisit = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const today = getISTDate();  

    let userActivity = await UserActivity.findOne({ userId });

    if (!userActivity) {
      userActivity = await UserActivity.create({
        userId,
        activities: [{
          date: today,
          visitCount: 1,
          lastVisitTime: getISTDateTime()
        }]
      });
    } else {
      const existingActivity = userActivity.activities.find(activity => activity.date === today);
      
      if (existingActivity) {
        existingActivity.visitCount += 1;
        existingActivity.lastVisitTime = getISTDateTime();
      } else {
        userActivity.activities.push({
          date: today,
          visitCount: 1,
          lastVisitTime: getISTDateTime()
        });
      }
      
      await userActivity.save();
    }

    res.status(200).json({ success: true, message: 'Visit tracked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getUserActivity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { year } = req.query;

    const userActivity = await UserActivity.findOne({ userId });
    
    if (!userActivity) {
      return res.status(200).json({ success: true, data: [] });
    }

    const targetYear = year || new Date().getFullYear();
    const filteredActivities = userActivity.activities.filter(activity => 
      activity.date.startsWith(targetYear.toString())
    );

    const activityData = filteredActivities.map(activity => ({
      date: activity.date,
      count: activity.visitCount,
      level: Math.min(Math.floor(activity.visitCount / 2) + 1, 4)
    }));

    res.status(200).json({ success: true, data: activityData });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};


export const getUserActivityById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { year } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const userActivity = await UserActivity.findOne({ userId }).populate('userId', 'name email');
    
    if (!userActivity) {
      return res.status(404).json({ 
        success: false, 
        message: 'No activity found for this user' 
      });
    }

    const targetYear = year || new Date().getFullYear();
    const filteredActivities = userActivity.activities.filter(activity => 
      activity.date.startsWith(targetYear.toString())
    );

    const activityData = filteredActivities.map(activity => ({
      date: activity.date,
      count: activity.visitCount,
      level: Math.min(Math.floor(activity.visitCount / 2) + 1, 4),
      lastVisitTime: activity.lastVisitTime
    }));

    res.status(200).json({ 
      success: true, 
      userId,
      totalDays: filteredActivities.length,
      totalVisits: filteredActivities.reduce((sum, activity) => sum + activity.visitCount, 0),
      data: activityData,
      user: userActivity.userId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};