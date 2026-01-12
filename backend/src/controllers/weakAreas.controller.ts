import { Request, Response } from 'express';
import { UserModel } from '../models/User.model';


export const getWeakAreas = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: [],
        totalWeakAreas: 0
      });
    }

    const progressTracker = user.progressTracker[0];
    const weakAreas = progressTracker.weekareas || [];

    return res.status(200).json({
      success: true,
      totalWeakAreas: weakAreas.length,
      data: weakAreas
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get weak areas' });
  }
};


export const getWeakAreasByTopic = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(200).json({ success: true, data: {} });
    }

    const progressTracker = user.progressTracker[0];
    const weakAreas = progressTracker.weekareas || [];


    const groupedByTopic = weakAreas.reduce((acc: any, area: any) => {
      const topic = area.topic || 'Unknown';
      if (!acc[topic]) {
        acc[topic] = [];
      }
      acc[topic].push(area);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      totalTopics: Object.keys(groupedByTopic).length,
      data: groupedByTopic
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to get weak areas by topic' });
  }
};


export const clearWeakAreas = async (req: any, res: Response): Promise<Response> => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.progressTracker || user.progressTracker.length === 0) {
      return res.status(200).json({ success: true, message: 'No weak areas to clear' });
    }

    const progressTracker = user.progressTracker[0];
    progressTracker.weekareas = [];

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Weak areas cleared successfully'
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to clear weak areas' });
  }
};