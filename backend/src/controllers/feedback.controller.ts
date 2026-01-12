import { Request, Response } from 'express';
import { FeedbackModel } from '../models/Feedback.model';
import { UserModel } from '../models/User.model';

interface AuthRequest extends Request {
  userId?: string;
}

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await FeedbackModel.create({
      userId,
      name: user.name,
      email: user.email,
      subject: 'User Feedback',
      message
    });

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};