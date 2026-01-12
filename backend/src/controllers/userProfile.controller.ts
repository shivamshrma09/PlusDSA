import { Response } from 'express';
import { AuthRequest } from '../middleware/cookie-auth.middleware';
import { UserModel } from '../models/User.model';

export const addUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const profileData = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }


    user.profile = { ...user.profile, ...profileData };

    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: user.profile 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select('name email profile');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const profileData = {
      name: user.name,
      email: user.email,
      profile: user.profile || null
    };

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json({ success: true, data: profileData });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};